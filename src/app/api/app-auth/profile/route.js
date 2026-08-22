import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

// Helper function to extract token from request
function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return request.cookies.get('app_token')?.value;
}

// Decode and validate JWT, returns { decoded, error }
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');
    if (decoded.type !== 'patient' && decoded.type !== 'student') {
      return { error: 'Invalid token type' };
    }
    return { decoded };
  } catch (error) {
    return { error: 'Invalid or expired token' };
  }
}

// Resolve table name and ID column based on user type
function resolveTable(decoded) {
  if (decoded.type === 'patient') {
    return { table: 'patient_users', idColumn: 'patient_id', idValue: decoded.patientId };
  }
  return { table: 'student_users', idColumn: 'student_id', idValue: decoded.studentId };
}

// GET - Get profile fields (works for both patient and student)
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { decoded, error } = decodeToken(token);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    const { table, idColumn, idValue } = resolveTable(decoded);

    const result = await query(
      `SELECT idol, personality, goals, challenges,
              communication_style, interests, values, support_needs,
              updated_at
       FROM ${table}
       WHERE ${idColumn} = $1 AND is_active = true`,
      [idValue]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const profile = result.rows[0];

    return NextResponse.json({
      success: true,
      userType: decoded.type,
      profile: {
        idol: profile.idol,
        personality: profile.personality,
        goals: profile.goals,
        challenges: profile.challenges,
        communicationStyle: profile.communication_style,
        interests: profile.interests,
        values: profile.values,
        supportNeeds: profile.support_needs,
        updatedAt: profile.updated_at
      }
    });

  } catch (error) {
    console.error('GET app-auth profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Shared profile update handler
async function handleProfileUpdate(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { decoded, error } = decodeToken(token);
  if (error) {
    return NextResponse.json({ error }, { status: 401 });
  }

  const { table, idColumn, idValue } = resolveTable(decoded);

  const body = await request.json();

  // Map fast-track onboarding fields to database fields
  const idol = body.idol || body.inspirationFigure;
  const personality = body.personality || body.inspirationQuality;
  const goals = body.goals || body.primaryHope;
  const challenges = body.challenges || body.spiritualReflection;
  const communicationStyle = body.communicationStyle || body.actorAuthorTone;
  const interests = body.interests || body.spiritualPractices;
  const values = body.values || body.chapterTitle;
  const supportNeeds = body.supportNeeds || body.actorAuthorStyle;

  // Build dynamic update query
  const updateFields = [];
  const updateValues = [];
  let paramCount = 1;

  if (idol !== undefined) {
    updateFields.push(`idol = $${paramCount}`);
    updateValues.push(idol);
    paramCount++;
  }
  if (personality !== undefined) {
    updateFields.push(`personality = $${paramCount}`);
    updateValues.push(personality);
    paramCount++;
  }
  if (goals !== undefined) {
    updateFields.push(`goals = $${paramCount}`);
    updateValues.push(goals);
    paramCount++;
  }
  if (challenges !== undefined) {
    updateFields.push(`challenges = $${paramCount}`);
    updateValues.push(challenges);
    paramCount++;
  }
  if (communicationStyle !== undefined) {
    updateFields.push(`communication_style = $${paramCount}`);
    updateValues.push(communicationStyle);
    paramCount++;
  }
  if (interests !== undefined) {
    updateFields.push(`interests = $${paramCount}`);
    updateValues.push(interests);
    paramCount++;
  }
  if (values !== undefined) {
    updateFields.push(`values = $${paramCount}`);
    updateValues.push(values);
    paramCount++;
  }
  if (supportNeeds !== undefined) {
    updateFields.push(`support_needs = $${paramCount}`);
    updateValues.push(supportNeeds);
    paramCount++;
  }

  if (updateFields.length === 0) {
    return NextResponse.json(
      { error: 'No fields provided for update' },
      { status: 400 }
    );
  }

  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  updateValues.push(idValue);

  const updateQuery = `
    UPDATE ${table}
    SET ${updateFields.join(', ')}
    WHERE ${idColumn} = $${paramCount} AND is_active = true
    RETURNING idol, personality, goals, challenges, communication_style, interests, values, support_needs, updated_at
  `;

  const result = await query(updateQuery, updateValues);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  const updatedProfile = result.rows[0];

  return NextResponse.json({
    success: true,
    message: 'Profile updated successfully',
    userType: decoded.type,
    profile: {
      idol: updatedProfile.idol,
      personality: updatedProfile.personality,
      goals: updatedProfile.goals,
      challenges: updatedProfile.challenges,
      communicationStyle: updatedProfile.communication_style,
      interests: updatedProfile.interests,
      values: updatedProfile.values,
      supportNeeds: updatedProfile.support_needs,
      updatedAt: updatedProfile.updated_at
    }
  });
}

// POST - Create/Update profile (for mobile app compatibility)
export async function POST(request) {
  try {
    return await handleProfileUpdate(request);
  } catch (error) {
    console.error('POST app-auth profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update profile fields
export async function PUT(request) {
  try {
    return await handleProfileUpdate(request);
  } catch (error) {
    console.error('PUT app-auth profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
