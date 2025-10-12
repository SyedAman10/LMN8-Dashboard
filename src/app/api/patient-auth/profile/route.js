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
  return request.cookies.get('patient_token')?.value;
}

// GET - Get patient profile fields
export async function GET(request) {
  try {
    console.log('📖 GET /api/patient-auth/profile called');
    const token = getTokenFromRequest(request);

    if (!token) {
      console.log('❌ No token found in request');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('🔑 Token found:', token.substring(0, 30) + '...');

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified for patient ID:', decoded.patientId);
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if token is for patient
    if (decoded.type !== 'patient') {
      console.log('❌ Invalid token type:', decoded.type);
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 401 }
      );
    }

    console.log('🔍 Fetching profile for patient ID:', decoded.patientId);

    // Get patient profile fields
    const result = await query(
      `SELECT 
        pu.idol, pu.personality, pu.goals, pu.challenges,
        pu.communication_style, pu.interests, pu.values, pu.support_needs,
        pu.updated_at
       FROM patient_users pu
       WHERE pu.patient_id = $1 AND pu.is_active = true`,
      [decoded.patientId]
    );

    if (result.rows.length === 0) {
      console.log('❌ Patient profile not found for patient ID:', decoded.patientId);
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }

    const profile = result.rows[0];
    console.log('✅ Profile fetched successfully');

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
    console.error('❌ Get patient profile error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Shared function to handle profile updates (for both POST and PUT)
async function handleProfileUpdate(request, methodName) {
  console.log(`✏️ ${methodName} /api/patient-auth/profile called`);
  
  const token = getTokenFromRequest(request);

  if (!token) {
    console.log('❌ No token found in request');
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  console.log('🔑 Token found:', token.substring(0, 30) + '...');

  // Verify JWT token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for patient ID:', decoded.patientId);
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Check if token is for patient
  if (decoded.type !== 'patient') {
    console.log('❌ Invalid token type:', decoded.type);
    return NextResponse.json(
      { error: 'Invalid token type' },
      { status: 401 }
    );
  }

  const body = await request.json();
  console.log('📝 Update data received:', Object.keys(body));
  
  const {
    idol,
    personality,
    goals,
    challenges,
    communicationStyle,
    interests,
    values,
    supportNeeds
  } = body;

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
    console.log('❌ No fields provided for update');
    return NextResponse.json(
      { error: 'No fields provided for update' },
      { status: 400 }
    );
  }

  console.log('📝 Updating fields:', updateFields.map(f => f.split(' = ')[0]));

  // Add updated_at and patient_id
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  updateValues.push(decoded.patientId);

  const updateQuery = `
    UPDATE patient_users 
    SET ${updateFields.join(', ')}
    WHERE patient_id = $${paramCount} AND is_active = true
    RETURNING idol, personality, goals, challenges, communication_style, interests, values, support_needs, updated_at
  `;

  console.log('🔄 Executing update for patient ID:', decoded.patientId);
  const result = await query(updateQuery, updateValues);

  if (result.rows.length === 0) {
    console.log('❌ Patient profile not found for patient ID:', decoded.patientId);
    return NextResponse.json(
      { error: 'Patient profile not found' },
      { status: 404 }
    );
  }

  const updatedProfile = result.rows[0];
  console.log('✅ Profile updated successfully');

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

// POST - Create/Update patient profile (for mobile app compatibility)
export async function POST(request) {
  try {
    return await handleProfileUpdate(request, 'POST');
  } catch (error) {
    console.error('❌ POST patient profile error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update patient profile fields
export async function PUT(request) {
  try {
    return await handleProfileUpdate(request, 'PUT');
  } catch (error) {
    console.error('❌ PUT patient profile error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
