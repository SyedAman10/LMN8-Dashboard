# 🔐 Patient Authentication API Documentation

This document describes the patient authentication API endpoints for the Luminate Clinician application. These endpoints are designed to work with your existing Expo mobile app.

## 📋 **Overview**

The patient authentication system provides:
- **Auto-generated credentials** when patients are added
- **Secure JWT-based authentication** for mobile apps
- **Email delivery** of login credentials
- **Session management** with HTTP-only cookies

## 🚀 **Base URL**

```
http://localhost:3001/api/patient-auth
```

## 📡 **Endpoints**

### 1. **Patient Login**

**POST** `/api/patient-auth/login`

Authenticates a patient using their username and password.

#### **Request Body**
```json
{
  "username": "johnsmith123",
  "password": "SecurePass123!"
}
```

#### **Response (Success - 200)**
```json
{
  "success": true,
  "message": "Login successful",
  "patient": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "diagnosis": "Anxiety Disorder",
    "medicalHistory": "Previous treatment...",
    "emergencyContact": "Jane Smith",
    "emergencyPhone": "+1234567891",
    "therapist": "Dr. Jane Doe",
    "totalSessions": 12,
    "sessionsCompleted": 3,
    "status": "active",
    "notes": "Patient notes...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "user": {
    "id": 1,
    "username": "johnsmith123"
  }
}
```

#### **Response (Error - 401)**
```json
{
  "error": "Invalid credentials"
}
```

#### **Response (Error - 400)**
```json
{
  "error": "Username and password are required"
}
```

### 2. **Patient Logout**

**POST** `/api/patient-auth/logout`

Logs out the current patient and clears their session.

#### **Request**
No body required. Uses the `patient_token` cookie for authentication.

#### **Response (Success - 200)**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 3. **Get Current Patient**

**GET** `/api/patient-auth/me`

Returns the current authenticated patient's information.

#### **Request**
No body required. Uses the `patient_token` cookie for authentication.

#### **Response (Success - 200)**
```json
{
  "success": true,
  "patient": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "diagnosis": "Anxiety Disorder",
    "medicalHistory": "Previous treatment...",
    "emergencyContact": "Jane Smith",
    "emergencyPhone": "+1234567891",
    "therapist": "Dr. Jane Doe",
    "totalSessions": 12,
    "sessionsCompleted": 3,
    "status": "active",
    "notes": "Patient notes...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "username": "johnsmith123",
    "lastLogin": "2024-01-01T12:00:00.000Z"
  }
}
```

#### **Response (Error - 401)**
```json
{
  "error": "Not authenticated"
}
```

## 🔧 **Authentication Flow**

### **1. Patient Registration (Automatic)**
When a clinician adds a new patient with an email address:

1. **Patient record** is created in the database
2. **User account** is automatically generated with:
   - Unique username (based on patient name)
   - Secure random password (12 characters)
3. **Two emails** are sent to the patient:
   - **Welcome email** with treatment details
   - **Credentials email** with login information

### **2. Patient Login (Mobile App)**
```javascript
// Example login request from your Expo app
const loginPatient = async (username, password) => {
  try {
    const response = await fetch('http://localhost:3001/api/patient-auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Patient logged in successfully
      // The patient_token cookie is automatically set
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

### **3. Authenticated Requests**
```javascript
// Example authenticated request
const getPatientInfo = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/patient-auth/me', {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.patient;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Failed to get patient info:', error);
    throw error;
  }
};
```

## 🔐 **Security Features**

### **Password Generation**
- **12 characters** with mixed case, numbers, and symbols
- **Cryptographically secure** random generation
- **Unique per patient** - no reuse

### **Username Generation**
- **Based on patient name** for easy identification
- **Unique across all patients** - auto-incremented if needed
- **URL-safe characters** only

### **JWT Tokens**
- **7-day expiration** for security
- **HTTP-only cookies** prevent XSS attacks
- **Secure in production** with HTTPS
- **Patient-specific** tokens

### **Password Hashing**
- **bcrypt** with 12 salt rounds
- **One-way encryption** - passwords cannot be recovered
- **Industry standard** security

## 📧 **Email Templates**

### **Credentials Email**
Patients receive a beautiful HTML email containing:
- **Username and password** in a secure format
- **Security instructions** and best practices
- **Treatment team information**
- **Professional branding** consistent with the app

### **Welcome Email**
Patients also receive a welcome email with:
- **Treatment details** and progress tracking
- **Therapist information**
- **Portal access instructions**
- **Support contact information**

## 🧪 **Testing the API**

### **Test Patient Creation**
1. Go to: http://localhost:3001/dashboard
2. Add a new patient with an email address
3. Check the patient's email for credentials
4. Use the credentials to test login

### **Test API Endpoints**
```bash
# Test login
curl -X POST http://localhost:3001/api/patient-auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser123", "password": "TestPass123!"}' \
  -c cookies.txt

# Test authenticated request
curl -X GET http://localhost:3001/api/patient-auth/me \
  -b cookies.txt

# Test logout
curl -X POST http://localhost:3001/api/patient-auth/logout \
  -b cookies.txt
```

## 📱 **Expo App Integration**

### **Install Dependencies**
```bash
npm install @react-native-async-storage/async-storage
```

### **Example React Native Code**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

class PatientAuthService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api/patient-auth';
  }

  async login(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        // Store patient data locally
        await AsyncStorage.setItem('patient', JSON.stringify(data.patient));
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async getCurrentPatient() {
    try {
      const response = await fetch(`${this.baseURL}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        await AsyncStorage.setItem('patient', JSON.stringify(data.patient));
        return data.patient;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to get patient info:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      await AsyncStorage.removeItem('patient');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}

export default new PatientAuthService();
```

## 🚨 **Error Handling**

### **Common Error Codes**
- **400**: Bad Request (missing required fields)
- **401**: Unauthorized (invalid credentials or expired token)
- **404**: Not Found (patient not found)
- **500**: Internal Server Error

### **Error Response Format**
```json
{
  "error": "Error message description"
}
```

## 🔄 **Database Schema**

### **patient_users Table**
```sql
CREATE TABLE patient_users (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 **Next Steps**

1. **Test the API** with your Expo app
2. **Customize email templates** if needed
3. **Add additional patient endpoints** (update profile, change password, etc.)
4. **Implement push notifications** for session reminders
5. **Add patient activity logging** for audit trails

---

**Need Help?** Check the console logs for detailed error messages or contact the development team.

**Happy Coding!** 🚀📱
