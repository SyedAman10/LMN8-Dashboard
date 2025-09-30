import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/auth';
import { initDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
      return NextResponse.json(
        { 
          error: 'Database not configured. Please set DATABASE_URL environment variable.',
          details: 'Contact your administrator or check the setup documentation.'
        },
        { status: 500 }
      );
    }

    // Initialize database if needed
    await initDatabase();

    const body = await request.json();
    const { firstName, lastName, email, password, role, licenseNumber } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate role-specific requirements
    if (role === 'clinician' && !licenseNumber) {
      return NextResponse.json(
        { error: 'License number is required for clinicians' },
        { status: 400 }
      );
    }

    // Create user
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password,
      role,
      licenseNumber
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.created_at
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    
    // Provide more specific error messages
    if (error.message.includes('connection string not configured')) {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          details: 'Please set DATABASE_URL environment variable'
        },
        { status: 500 }
      );
    }
    
    if (error.message.includes('Database connection failed')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: 'Please check your database connection string'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
