# Database Setup Instructions

This application uses Neon PostgreSQL database with connection pooling for authentication and data management.

## Prerequisites

1. **Neon Database Account**: Sign up at [neon.tech](https://neon.tech)
2. **Node.js**: Version 18 or higher
3. **Environment Variables**: Set up your database connection

## Setup Steps

### 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://username:password@hostname/database?sslmode=require`)

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Neon Database Configuration
DATABASE_URL=your_neon_database_url_here
NEON_DATABASE_URL=your_neon_database_url_here

# JWT Secret for authentication (generate a random string)
JWT_SECRET=your_jwt_secret_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database Schema

Run the database initialization script:

```bash
node src/scripts/init-db.js
```

This will create the following tables:
- `users` - User authentication and profile data
- `user_sessions` - Session management for login persistence
- `patients` - Patient data and medical records

### 5. Start the Application

```bash
npm run dev
```

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `first_name` - User's first name
- `last_name` - User's last name
- `role` - User role (clinician, researcher, student, other)
- `license_number` - License number for clinicians
- `is_active` - Account status
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### User Sessions Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `session_token` - Unique session identifier
- `expires_at` - Session expiration timestamp
- `created_at` - Session creation timestamp

### Patients Table
- `id` - Primary key
- `user_id` - Foreign key to users table (therapist)
- `name` - Patient's full name
- `email` - Patient's email
- `phone` - Patient's phone number
- `date_of_birth` - Patient's date of birth
- `diagnosis` - Medical diagnosis
- `medical_history` - Detailed medical history
- `emergency_contact` - Emergency contact name
- `emergency_phone` - Emergency contact phone
- `therapist` - Assigned therapist
- `total_sessions` - Total planned sessions
- `sessions_completed` - Number of completed sessions
- `status` - Patient status (active, completed, paused)
- `notes` - Additional notes
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

## Authentication Flow

1. **Signup**: Users create accounts with role-specific information
2. **Login**: Email/password authentication with session management
3. **Session Management**: HTTP-only cookies for secure session persistence
4. **Logout**: Session cleanup and cookie removal
5. **Protected Routes**: Dashboard and other pages require authentication

## API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user and create session
- `POST /api/auth/logout` - End user session
- `GET /api/auth/me` - Get current user information

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **Role-based Access**: Different user roles with appropriate permissions

## Troubleshooting

### Connection Issues
- Verify your DATABASE_URL is correct
- Check that your Neon database is active
- Ensure your IP is whitelisted (if required)

### Authentication Issues
- Check that JWT_SECRET is set
- Verify session cookies are being set
- Check browser developer tools for errors

### Database Errors
- Run the initialization script again
- Check database logs in Neon console
- Verify table permissions

## Development Notes

- The database connection uses connection pooling for better performance
- Sessions are automatically cleaned up when they expire
- All database operations use parameterized queries for security
- The application includes proper error handling and logging
