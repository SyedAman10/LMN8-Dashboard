import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

// Helper function to extract token from request
function getTokenFromRequest(request) {
  // Try Authorization header first (for mobile apps)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Fallback to cookie (for web)
  return request.cookies.get('student_token')?.value;
}

// GET - Get student profile fields
export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (decoded.type !== 'student') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT
        su.idol, su.personality, su.goals, su.challenges,
        su.communication_style, su.interests, su.values, su.support_needs,
        su.updated_at
       FROM student_users su
       WHERE su.student_id = $1 AND su.is_active = true`,
      [decoded.studentId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    const profile = result.rows[0];

    return NextResponse.json({
      success: true,
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
    console.error('Get student profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Shared function to handle profile updates (for both POST and PUT)
async function handleProfileUpdate(request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_this_in_production');
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  if (decoded.type !== 'student') {
    return NextResponse.json(
      { error: 'Invalid token type' },
      { status: 401 }
    );
  }

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

  // Build dynamic update query based on provided fields
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

  // Add updated_at and student_id
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  updateValues.push(decoded.studentId);

  const updateQuery = `
    UPDATE student_users
    SET ${updateFields.join(', ')}
    WHERE student_id = $${paramCount} AND is_active = true
    RETURNING idol, personality, goals, challenges, communication_style, interests, values, support_needs, updated_at
  `;

  const result = await query(updateQuery, updateValues);

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: 'Student profile not found' },
      { status: 404 }
    );
  }

  const updatedProfile = result.rows[0];

  return NextResponse.json({
    success: true,
    message: 'Profile updated successfully',
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

// POST - Create/Update student profile (for mobile app compatibility)
export async function POST(request) {
  try {
    return await handleProfileUpdate(request);
  } catch (error) {
    console.error('POST student profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update student profile fields
export async function PUT(request) {
  try {
    return await handleProfileUpdate(request);
  } catch (error) {
    console.error('PUT student profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
