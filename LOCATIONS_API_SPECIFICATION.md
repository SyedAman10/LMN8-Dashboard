# Multi-Location Management & RBAC API Specification

## Overview
API specification for managing multiple clinic locations and implementing role-based access control (RBAC) for different user types.

---

## Base URL
All endpoints should be prefixed with your API base URL:
```
https://your-api-domain.com/api
```

---

## Authentication
All endpoints require authentication. Include credentials in:
- **Cookie**: `session_token` (for session-based auth)
- **Header**: `Authorization: Bearer <token>` (for JWT auth)

**Authentication Failure Response (401)**:
```json
{
  "error": "Not authenticated",
  "message": "Please login to access this resource"
}
```

---

## API Endpoints - Locations

### 1. GET /api/locations
**Description**: Fetch all locations for the authenticated user/organization

**Request**:
- Method: `GET`
- Authentication: Required
- Query Parameters: None

**Response (200 - Success)**:
```json
{
  "locations": [
    {
      "id": "uuid",
      "name": "Downtown Clinic",
      "address": "123 Main St",
      "city": "Portland",
      "state": "OR",
      "zipCode": "97201",
      "phone": "(555) 123-4567",
      "email": "downtown@clinic.com",
      "managerName": "Dr. Jane Smith",
      "establishedDate": "2020-01-15",
      "status": "active",
      "staffCount": 25,
      "patientCount": 150,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 3
}
```

---

### 2. POST /api/locations
**Description**: Create a new location

**Request Body**:
```json
{
  "name": "Downtown Clinic",
  "address": "123 Main St",
  "city": "Portland",
  "state": "OR",
  "zipCode": "97201",
  "phone": "(555) 123-4567",
  "email": "downtown@clinic.com",
  "managerName": "Dr. Jane Smith",
  "establishedDate": "2020-01-15",
  "status": "active"
}
```

**Required Fields**: `name`, `address`, `city`

**Response (201 - Success)**:
```json
{
  "success": true,
  "message": "Location created successfully",
  "location": { /* full location object */ }
}
```

---

### 3. PUT /api/locations/:id
**Description**: Update a location

**Request**: Same body structure as POST

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Location updated successfully",
  "location": { /* updated location object */ }
}
```

---

### 4. DELETE /api/locations/:id
**Description**: Delete/deactivate a location

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Location deleted successfully"
}
```

---

## API Endpoints - Users & RBAC

### 5. GET /api/users
**Description**: Fetch all users across locations with their roles and permissions

**Request**: 
- Method: `GET`
- Authentication: Required
- Query Parameters:
  - `locationId` (optional): Filter by location
  - `role` (optional): Filter by role
  - `status` (optional): Filter by status (active/inactive)

**Response (200 - Success)**:
```json
{
  "users": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@clinic.com",
      "phone": "(555) 987-6543",
      "role": "clinician",
      "roleLabel": "Clinician",
      "locationId": "location-uuid",
      "locationName": "Downtown Clinic",
      "department": "Mental Health",
      "licenseNumber": "OR-LIC-12345",
      "status": "active",
      "permissions": [
        "view_patients",
        "edit_patients",
        "create_treatment_plans",
        "view_sessions",
        "create_sessions"
      ],
      "lastLogin": "2024-01-20T15:30:00Z",
      "createdAt": "2023-06-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    }
  ],
  "total": 45
}
```

---

### 6. POST /api/users
**Description**: Create a new user/staff member with role assignment

**Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@clinic.com",
  "phone": "(555) 123-4567",
  "role": "clinician",
  "locationId": "location-uuid",
  "department": "Mental Health",
  "licenseNumber": "OR-LIC-67890",
  "status": "active",
  "password": "temporary-password-123" // Or auto-generate
}
```

**Required Fields**: `firstName`, `lastName`, `email`, `role`

**Role Options**:
- `admin` - Full system access
- `clinician` - Patient care, treatment plans
- `nurse` - Patient monitoring, documentation
- `frontDesk` - Scheduling, patient intake
- `finance` - Billing, payments, reports
- `staff` - General access

**Response (201 - Success)**:
```json
{
  "success": true,
  "message": "User created successfully. Credentials sent via email.",
  "user": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@clinic.com",
    "role": "clinician",
    "locationId": "location-uuid",
    "temporaryPassword": "Auto-generated-password-123",
    "loginLink": "https://app.clinic.com/login?token=..."
  },
  "credentialsEmailed": true
}
```

---

### 7. PUT /api/users/:id
**Description**: Update user information including role changes

**Request**: Same body structure as POST (partial updates allowed)

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": { /* updated user object */ }
}
```

---

### 8. DELETE /api/users/:id
**Description**: Deactivate a user (soft delete for audit trail)

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

---

## Role Permissions Matrix

### Admin
- ✅ Full system access
- ✅ Manage locations
- ✅ Manage users (create, edit, delete)
- ✅ View all patient records
- ✅ Access all financial data
- ✅ Configure system settings
- ✅ Generate all reports

### Clinician
- ✅ View assigned patients
- ✅ Create/edit treatment plans
- ✅ Document sessions
- ✅ View patient history
- ✅ Schedule sessions
- ❌ Access financial data
- ❌ Manage other users

### Nurse
- ✅ View assigned patients
- ✅ Document patient vitals
- ✅ Update patient status
- ✅ View session notes
- ❌ Create treatment plans
- ❌ Access financial data

### Front Desk
- ✅ Schedule appointments
- ✅ Patient intake
- ✅ View patient basic info
- ✅ Manage appointments
- ❌ View medical records
- ❌ Access financial data

### Finance
- ✅ View billing information
- ✅ Process payments
- ✅ Generate financial reports
- ✅ Manage invoices
- ❌ View medical records
- ❌ Manage patients

---

## Database Schema

### locations table
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_locations_status (status),
  INDEX idx_locations_created_at (created_at DESC)
);
```

### users table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  location_id UUID REFERENCES locations(id),
  department VARCHAR(100),
  license_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_location_id (location_id),
  INDEX idx_users_status (status)
);
```

### role_permissions table (optional - for dynamic permissions)
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role VARCHAR(50) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(role, permission),
  INDEX idx_role_permissions_role (role)
);

-- Pre-populated data
INSERT INTO role_permissions (role, permission) VALUES
  ('admin', 'full_access'),
  ('admin', 'manage_locations'),
  ('admin', 'manage_users'),
  ('admin', 'view_all_patients'),
  ('admin', 'access_financial_data'),
  
  ('clinician', 'view_assigned_patients'),
  ('clinician', 'create_treatment_plans'),
  ('clinician', 'document_sessions'),
  ('clinician', 'view_patient_history'),
  ('clinician', 'schedule_sessions'),
  
  ('nurse', 'view_assigned_patients'),
  ('nurse', 'document_vitals'),
  ('nurse', 'update_patient_status'),
  ('nurse', 'view_session_notes'),
  
  ('frontDesk', 'schedule_appointments'),
  ('frontDesk', 'patient_intake'),
  ('frontDesk', 'view_basic_patient_info'),
  ('frontDesk', 'manage_appointments'),
  
  ('finance', 'view_billing'),
  ('finance', 'process_payments'),
  ('finance', 'generate_financial_reports'),
  ('finance', 'manage_invoices');
```

---

## Business Logic

### Location Management
- Each location is independent with its own staff and patients
- Location status affects visibility:
  - `active`: Fully operational, visible to users
  - `inactive`: Archived but data preserved
- Location deletion should soft-delete (archive) to preserve audit trail

### User Management
- Users can be assigned to specific locations
- Role determines access level across the system
- Password reset should be handled via email
- User status:
  - `active`: Can login and access system
  - `inactive`: Blocked from login
  - `suspended`: Temporary suspension

### Permission Checks
When any protected resource is accessed:
1. Authenticate user (verify token/session)
2. Check user role
3. Verify user has required permission for action
4. If location-specific, verify user has access to that location

**Example Permission Check**:
```javascript
// In your middleware or route handler
if (user.role === 'admin' || hasPermission(user.role, 'view_patients')) {
  // Allow access
} else {
  return { error: 'Insufficient permissions', status: 403 };
}
```

### User Creation Flow
1. Validate user data
2. Check if email already exists
3. Create user record
4. Generate temporary password
5. Assign to location
6. Store role and permissions
7. Send welcome email with credentials
8. Return user object

---

## Error Handling

All endpoints should return appropriate HTTP status codes:
- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation error
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found
- `409`: Conflict (e.g., duplicate email)
- `500`: Internal server error

**Error Response Format**:
```json
{
  "error": "Error type",
  "message": "Human readable message",
  "details": "Specific error details (optional)"
}
```

---

## Security Considerations

1. **Authorization**: Always verify user has permission for action
2. **Role-Based Access**: Enforce at API level, not just UI
3. **Location Isolation**: Users should only access their assigned location(s) data
4. **Password Policy**: Enforce strong passwords, password history
5. **Audit Logging**: Log all user actions, role changes, permission changes
6. **Session Management**: Secure session tokens, implement logout
7. **Data Privacy**: Ensure HIPAA compliance for patient data

---

## API Response Time Requirements

- Location CRUD: < 500ms
- User CRUD: < 500ms
- Permission checks: < 50ms
- User list with filters: < 1s

---

## Testing Checklist

- [ ] Create location with valid data
- [ ] Create location with missing required fields (should fail)
- [ ] Update location information
- [ ] Delete location (soft delete)
- [ ] Create user with each role type
- [ ] Create user with duplicate email (should fail)
- [ ] Update user role and verify permissions change
- [ ] Deactivate user and verify login blocked
- [ ] Permission checks for each role
- [ ] Location-based data filtering
- [ ] Authentication failures (401)
- [ ] Authorization failures (403)
- [ ] Email delivery for credentials

---

## Priority Implementation

**Phase 1 (MVP)**:
1. GET /api/locations
2. POST /api/locations
3. GET /api/users
4. POST /api/users
5. Basic permission checks

**Phase 2 (Enhancement)**:
6. PUT /api/locations/:id
7. PUT /api/users/:id
8. DELETE /api/locations/:id
9. DELETE /api/users/:id
10. Role permission matrix enforcement

**Phase 3 (Advanced)**:
11. Dynamic permissions system
12. Audit logging for all actions
13. Advanced filtering and search
14. Bulk user import
15. Location performance metrics

---

## Example Use Cases

### Create New Location
1. Admin navigates to Locations page
2. Clicks "Add Location"
3. Fills in location details
4. Submits form → POST /api/locations
5. Backend creates location record
6. Returns success with location ID
7. UI refreshes to show new location

### Add Clinician to Location
1. Admin navigates to Users tab
2. Clicks "Add User"
3. Selects "clinician" role
4. Assigns to specific location
5. Enters clinician details (license, department)
6. Submits form → POST /api/users
7. Backend:
   - Creates user record
   - Generates temporary password
   - Sends credentials email
8. Clinician receives email with login credentials
9. Clinician can now login and access patients in their location

---

## Summary

This system provides:
✅ Multi-location management for clinics with multiple branches
✅ Role-based access control (Admin, Clinician, Nurse, Front Desk, Finance)
✅ Location-based data filtering
✅ User management with automatic credential distribution
✅ Secure permission enforcement at API level

**Total Endpoints**: 8 (4 for locations, 4 for users)
**Database Tables**: 3 (locations, users, role_permissions)
**Key Features**: RBAC, multi-tenancy, secure authentication

