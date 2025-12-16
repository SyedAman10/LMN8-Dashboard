# Backend Prompt for Multi-Location & RBAC System

## Quick Summary
Build a RESTful API for managing multiple clinic locations and implementing role-based access control (RBAC) with different user types and permissions.

---

## What to Build

### Core Functionality
1. **Multi-Location Management**: Track and manage multiple clinic branches
2. **Role-Based Access Control**: Different permissions for Admin, Clinician, Nurse, Front Desk, Finance, Staff

---

## Required API Endpoints

### Locations (4 endpoints)
```
GET    /api/locations         - List all locations
POST   /api/locations         - Create new location
PUT    /api/locations/:id     - Update location
DELETE /api/locations/:id     - Delete location
```

### Users & RBAC (4 endpoints)
```
GET    /api/users             - List all users with roles
POST   /api/users             - Create new user with role
PUT    /api/users/:id         - Update user (including role change)
DELETE /api/users/:id         - Deactivate user
```

**Total: 8 endpoints**

---

## User Roles & Permissions

### Admin (Full Access)
- ✅ Manage locations
- ✅ Manage users
- ✅ View all patient records
- ✅ Access financial data
- ✅ System configuration

### Clinician (Patient Care)
- ✅ View assigned patients
- ✅ Create treatment plans
- ✅ Document sessions
- ✅ View patient history
- ❌ No financial access

### Nurse (Monitoring)
- ✅ View assigned patients
- ✅ Document vitals
- ✅ Update patient status
- ✅ View session notes
- ❌ No treatment plan creation

### Front Desk (Scheduling)
- ✅ Schedule appointments
- ✅ Patient intake
- ✅ View basic patient info
- ❌ No medical records

### Finance (Billing)
- ✅ View billing information
- ✅ Process payments
- ✅ Generate financial reports
- ❌ No medical records

### Staff (General)
- ✅ Basic system access
- Limited permissions based on department

---

## Database Schema

### locations table
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  zip_code VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  manager_name VARCHAR(255),
  established_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### users table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,  -- admin, clinician, nurse, frontDesk, finance, staff
  location_id UUID REFERENCES locations(id),
  department VARCHAR(100),
  license_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### role_permissions table (for dynamic permissions)
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMP,
  UNIQUE(role, permission)
);
```

---

## Request/Response Examples

### Create Location
```javascript
POST /api/locations
{
  "name": "Downtown Clinic",
  "address": "123 Main St",
  "city": "Portland",
  "state": "OR",
  "zipCode": "97201",
  "phone": "(555) 123-4567",
  "email": "downtown@clinic.com",
  "managerName": "Dr. Jane Smith",
  "status": "active"
}

Response (201):
{
  "success": true,
  "message": "Location created successfully",
  "location": { id: "uuid", name: "Downtown Clinic", ... }
}
```

### Create User
```javascript
POST /api/users
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@clinic.com",
  "phone": "(555) 987-6543",
  "role": "clinician",
  "locationId": "location-uuid",
  "department": "Mental Health",
  "licenseNumber": "OR-LIC-12345",
  "status": "active"
}

Response (201):
{
  "success": true,
  "message": "User created successfully. Credentials sent via email.",
  "user": {
    "id": "uuid",
    "email": "john.doe@clinic.com",
    "role": "clinician",
    "temporaryPassword": "Auto-generated-password"
  },
  "credentialsEmailed": true
}
```

### Get All Users with Roles
```javascript
GET /api/users

Response (200):
{
  "users": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@clinic.com",
      "role": "clinician",
      "roleLabel": "Clinician",
      "locationName": "Downtown Clinic",
      "department": "Mental Health",
      "status": "active",
      "permissions": [
        "view_assigned_patients",
        "create_treatment_plans",
        "document_sessions"
      ]
    }
  ],
  "total": 45
}
```

---

## Key Business Logic

### Location Management
- Each location operates independently
- Soft-delete when removing locations (preserve audit trail)
- Location status: `active` or `inactive`

### User Management
- User creation requires: firstName, lastName, email, role
- Auto-generate temporary password
- Send credentials via email
- Role determines available permissions
- Users can be assigned to specific locations
- Soft-delete when removing users (status = 'inactive')

### Permission Enforcement
Check permissions before allowing actions:
```javascript
// Example middleware
if (user.role === 'admin' || hasPermission(user.role, 'view_patients')) {
  // Allow access
} else {
  return { error: 'Insufficient permissions', status: 403 };
}
```

### Role-Based Data Filtering
- Users see only data from their assigned location(s)
- Admin sees all locations
- Other roles see only their location

---

## Error Handling

Return proper HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Validation error
- `401`: Unauthorized
- `403`: Insufficient permissions
- `404`: Not found
- `409`: Conflict (duplicate email)
- `500`: Server error

**Error Response Format**:
```json
{
  "error": "Error type",
  "message": "Human readable message",
  "details": "Specific error details"
}
```

---

## Security Requirements

1. **Authentication**: All endpoints require valid session/token
2. **Authorization**: Check user role and permissions
3. **Location Isolation**: Users can only access their location(s) data
4. **Password Security**: Enforce strong passwords, hash with bcrypt
5. **Audit Logging**: Log all CRUD operations for compliance
6. **Session Management**: Secure tokens, implement logout
7. **HIPAA Compliance**: Protect patient data, enforce access controls

---

## Testing Priorities

**Phase 1 (MVP)**:
1. ✅ Create location
2. ✅ List locations
3. ✅ Create user with role
4. ✅ List users with roles
5. ✅ Basic permission checks

**Phase 2**:
6. ✅ Update location
7. ✅ Update user role
8. ✅ Delete/deactivate location
9. ✅ Delete/deactivate user
10. ✅ Permission enforcement

**Phase 3**:
11. Location-based data filtering
12. Advanced permission matrix
13. Audit logging
14. Bulk operations

---

## Complete API Documentation

See `LOCATIONS_API_SPECIFICATION.md` for:
- Complete request/response examples
- Detailed database schemas
- Role permission matrix
- Security considerations
- Performance requirements

---

## Questions?

Refer to the frontend implementation in `src/components/pages/LocationsContent.js` to see exactly how these APIs will be consumed.

