# API Configuration

## Backend Server Setup

Your backend server is running on **port 5000**.

## Environment Variable (Optional)

You can configure the API URL using an environment variable. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If `NEXT_PUBLIC_API_URL` is not set, it defaults to `http://localhost:5000`.

## API Endpoints

All API calls use the format:
```
http://localhost:5000/api/backend/...
```

### Examples:
- Notes: `http://localhost:5000/api/backend/patients/:patientId/notes`
- Documents: `http://localhost:5000/api/backend/patients/:patientId/documents`

## Authentication

The frontend automatically handles authentication by:
1. **On Login**: JWT token is generated and stored in `localStorage` as `authToken`
2. **On API Calls**: Token is retrieved from `localStorage` and sent as `Authorization: Bearer <jwt-token>` header
3. **On Page Refresh**: If user has valid session but no token, automatically fetches a new JWT token

**Token Format:**
- JWT token containing `userId`, `email`, `role`, and `type: 'user'`
- Stored in browser's `localStorage` as `authToken`
- Sent in `Authorization: Bearer <token>` header

**Backend Requirements:**
- Accept `Authorization: Bearer <jwt-token>` header
- Decode (not verify) the JWT token to extract `userId` or `patientId`
- The token payload contains user information for authentication

## CORS Configuration

Make sure your backend server (port 5000) allows requests from your Next.js frontend (usually port 3000). Configure CORS to allow:
- Origin: `http://localhost:3000`
- Headers: `Authorization`, `Content-Type`
- Credentials: `true` (optional, but recommended)

## Production

For production, update the `NEXT_PUBLIC_API_URL` environment variable to your production backend URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

