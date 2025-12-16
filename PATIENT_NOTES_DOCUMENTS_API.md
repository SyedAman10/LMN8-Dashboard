# Patient Notes & Documents API Specification

## Overview
API endpoints for managing patient notes and document uploads in the LMN8 Dashboard.

---

## Base URL
All endpoints should be prefixed with your API base URL:
```
https://your-api-domain.com/api/backend
```

**Note**: Your backend uses `/api/backend` prefix, so all endpoints start with `/api/backend/patients/...`

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

## API Endpoints - Patient Notes

### 1. GET /api/backend/patients/:patientId/notes
**Description**: Fetch all notes for a specific patient

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: `patientId` (patient ID)
- Query Parameters:
  - `limit` (optional): Number of notes to return (default: 50)
  - `offset` (optional): Pagination offset (default: 0)
  - `sortBy` (optional): Sort field - `date`, `author` (default: `date`)
  - `sortOrder` (optional): `asc` or `desc` (default: `desc`)

**Response (200 - Success)**:
```json
{
  "notes": [
    {
      "id": "uuid",
      "patientId": "patient-uuid",
      "authorId": "user-uuid",
      "authorName": "Dr. Jane Smith",
      "authorRole": "clinician",
      "note": "Patient showed significant progress in managing anxiety symptoms. Recommended continued therapy.",
      "noteType": "clinical", // clinical, session, general, followup
      "isPrivate": false,
      "tags": ["anxiety", "progress", "therapy"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25,
  "limit": 50,
  "offset": 0
}
```

---

### 2. POST /api/backend/patients/:patientId/notes
**Description**: Create a new note for a patient

**Request Body**:
```json
{
  "note": "Patient showed significant progress in managing anxiety symptoms. Recommended continued therapy.",
  "noteType": "clinical",
  "isPrivate": false,
  "tags": ["anxiety", "progress", "therapy"]
}
```

**Field Definitions**:
- `note` (string, required): The note content
- `noteType` (enum, optional): `clinical`, `session`, `general`, `followup` (default: `general`)
- `isPrivate` (boolean, optional): Whether note is private to author (default: `false`)
- `tags` (array, optional): Array of tag strings for categorization

**Response (201 - Success)**:
```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "id": "uuid",
    "patientId": "patient-uuid",
    "authorId": "user-uuid",
    "authorName": "Dr. Jane Smith",
    "authorRole": "clinician",
    "note": "Patient showed significant progress...",
    "noteType": "clinical",
    "isPrivate": false,
    "tags": ["anxiety", "progress", "therapy"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. PUT /api/backend/patients/:patientId/notes/:noteId
**Description**: Update an existing note

**Request**: Same body structure as POST (partial updates allowed)

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Note updated successfully",
  "note": { /* updated note object */ }
}
```

**Response (403 - Forbidden)**:
```json
{
  "error": "Forbidden",
  "message": "You can only edit your own notes"
}
```

---

### 4. DELETE /api/backend/patients/:patientId/notes/:noteId
**Description**: Delete a note

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Response (403 - Forbidden)**:
```json
{
  "error": "Forbidden",
  "message": "You can only delete your own notes"
}
```

---

### 5. GET /api/backend/patients/:patientId/notes/:noteId
**Description**: Get a specific note by ID

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: 
  - `patientId` (patient ID)
  - `noteId` (note ID)

**Response (200 - Success)**:
```json
{
  "note": {
    "id": "uuid",
    "patientId": "patient-uuid",
    "authorId": "user-uuid",
    "authorName": "Dr. Jane Smith",
    "authorRole": "clinician",
    "note": "Patient showed significant progress...",
    "noteType": "clinical",
    "isPrivate": false,
    "tags": ["anxiety", "progress"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 6. GET /api/backend/patients/:patientId/notes/search
**Description**: Search notes for a patient

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: `patientId` (patient ID)
- Query Parameters:
  - `q` (required): Search query string
  - `noteType` (optional): Filter by note type
  - `tags` (optional): Filter by tags (comma-separated)
  - `limit` (optional): Number of results (default: 50)
  - `offset` (optional): Pagination offset (default: 0)

**Response (200 - Success)**:
```json
{
  "notes": [ /* array of matching notes */ ],
  "total": 5,
  "query": "anxiety progress"
}
```

---

## API Endpoints - Patient Documents

### 7. GET /api/backend/patients/:patientId/documents
**Description**: Fetch all documents for a specific patient

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: `patientId` (patient ID)
- Query Parameters:
  - `category` (optional): Filter by category
  - `limit` (optional): Number of documents (default: 50)
  - `offset` (optional): Pagination offset (default: 0)

**Response (200 - Success)**:
```json
{
  "documents": [
    {
      "id": "uuid",
      "patientId": "patient-uuid",
      "uploadedById": "user-uuid",
      "uploadedByName": "Dr. Jane Smith",
      "fileName": "lab-results-2024.pdf",
      "originalFileName": "Lab Results 2024.pdf",
      "fileSize": 245760, // bytes
      "fileType": "application/pdf",
      "mimeType": "application/pdf",
      "category": "lab-results", // lab-results, medical-records, consent-forms, insurance, other
      "description": "Blood test results from annual checkup",
      "tags": ["lab", "blood-test", "annual"],
      "storagePath": "/documents/patient-uuid/lab-results-2024.pdf",
      "storageUrl": "https://storage.example.com/documents/patient-uuid/lab-results-2024.pdf",
      "isEncrypted": true,
      "encryptionKey": "encrypted-key-reference",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 12,
  "limit": 50,
  "offset": 0
}
```

---

### 8. POST /api/backend/patients/:patientId/documents
**Description**: Upload a new document for a patient

**Request**:
- Method: `POST`
- Authentication: Required
- Content-Type: `multipart/form-data`
- URL Parameters: `patientId` (patient ID)

**Form Data**:
- `file` (file, required): The document file to upload
- `category` (string, optional): Document category
- `description` (string, optional): Document description
- `tags` (string, optional): Comma-separated tags

**File Requirements**:
- Max file size: 10MB (configurable)
- Allowed file types: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
- Files should be encrypted at rest
- Store in secure cloud storage (AWS S3, Google Cloud Storage, etc.)

**Response (201 - Success)**:
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "document": {
    "id": "uuid",
    "patientId": "patient-uuid",
    "uploadedById": "user-uuid",
    "uploadedByName": "Dr. Jane Smith",
    "fileName": "lab-results-2024.pdf",
    "originalFileName": "Lab Results 2024.pdf",
    "fileSize": 245760,
    "fileType": "application/pdf",
    "mimeType": "application/pdf",
    "category": "lab-results",
    "description": "Blood test results from annual checkup",
    "tags": ["lab", "blood-test"],
    "storagePath": "/documents/patient-uuid/lab-results-2024.pdf",
    "storageUrl": "https://storage.example.com/documents/patient-uuid/lab-results-2024.pdf",
    "isEncrypted": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (400 - Validation Error)**:
```json
{
  "error": "Validation error",
  "message": "File size exceeds maximum allowed size of 10MB"
}
```

---

### 9. GET /api/backend/patients/:patientId/documents/:documentId
**Description**: Get document metadata

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: 
  - `patientId` (patient ID)
  - `documentId` (document ID)

**Response (200 - Success)**:
```json
{
  "document": {
    "id": "uuid",
    "patientId": "patient-uuid",
    "uploadedById": "user-uuid",
    "uploadedByName": "Dr. Jane Smith",
    "fileName": "lab-results-2024.pdf",
    "originalFileName": "Lab Results 2024.pdf",
    "fileSize": 245760,
    "fileType": "application/pdf",
    "mimeType": "application/pdf",
    "category": "lab-results",
    "description": "Blood test results from annual checkup",
    "tags": ["lab", "blood-test"],
    "storagePath": "/documents/patient-uuid/lab-results-2024.pdf",
    "storageUrl": "https://storage.example.com/documents/patient-uuid/lab-results-2024.pdf",
    "isEncrypted": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 10. GET /api/backend/patients/:patientId/documents/:documentId/download
**Description**: Download a document (returns file with proper headers)

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: 
  - `patientId` (patient ID)
  - `documentId` (document ID)

**Response (200 - Success)**:
- Content-Type: Based on file mime type
- Content-Disposition: `attachment; filename="original-filename.pdf"`
- Body: File content (binary)

**Response (404 - Not Found)**:
```json
{
  "error": "Document not found",
  "message": "Document with ID 'document-id' does not exist"
}
```

---

### 11. PUT /api/backend/patients/:patientId/documents/:documentId
**Description**: Update document metadata (not the file itself)

**Request**:
- Method: `PUT`
- Authentication: Required
- Content-Type: `application/json`
- URL Parameters: 
  - `patientId` (patient ID)
  - `documentId` (document ID)

**Request Body**:
```json
{
  "category": "medical-records",
  "description": "Updated description",
  "tags": ["updated", "tags"]
}
```

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Document metadata updated successfully",
  "document": { /* updated document object */ }
}
```

---

### 12. DELETE /api/backend/patients/:patientId/documents/:documentId
**Description**: Delete a document

**Request**:
- Method: `DELETE`
- Authentication: Required
- URL Parameters: 
  - `patientId` (patient ID)
  - `documentId` (document ID)

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Note**: This should also delete the file from storage.

---

## Database Schema

### patient_notes table
```sql
CREATE TABLE patient_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  note TEXT NOT NULL,
  note_type VARCHAR(50) DEFAULT 'general',
  is_private BOOLEAN DEFAULT false,
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_patient_notes_patient_id (patient_id),
  INDEX idx_patient_notes_author_id (author_id),
  INDEX idx_patient_notes_created_at (created_at DESC),
  INDEX idx_patient_notes_note_type (note_type)
);
```

### patient_documents table
```sql
CREATE TABLE patient_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  uploaded_by_id UUID NOT NULL REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  original_file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL, -- in bytes
  file_type VARCHAR(100) NOT NULL, -- MIME type
  mime_type VARCHAR(100) NOT NULL,
  category VARCHAR(50) DEFAULT 'other',
  description TEXT,
  tags TEXT[], -- Array of tags
  storage_path VARCHAR(500) NOT NULL,
  storage_url VARCHAR(500),
  is_encrypted BOOLEAN DEFAULT true,
  encryption_key VARCHAR(255), -- Reference to encryption key
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_patient_documents_patient_id (patient_id),
  INDEX idx_patient_documents_uploaded_by (uploaded_by_id),
  INDEX idx_patient_documents_category (category),
  INDEX idx_patient_documents_created_at (created_at DESC)
);
```

---

## Business Logic

### Notes
- Users can create notes for patients they have access to
- Users can only edit/delete their own notes (unless admin)
- Private notes are only visible to the author
- Notes are automatically timestamped
- Tags help with categorization and search

### Documents
- Files must be validated before upload (size, type)
- Files should be encrypted at rest
- Store files in secure cloud storage (not in database)
- Generate unique file names to prevent conflicts
- Track who uploaded each document
- Support multiple file types (PDF, images, etc.)
- Implement proper access control (HIPAA compliance)

### Security
- All file uploads must be scanned for malware
- Enforce file size limits
- Validate file types strictly
- Encrypt sensitive documents
- Log all document access for audit trail
- Implement proper access control

---

## Error Handling

All endpoints should return appropriate HTTP status codes:
- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation error
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found
- `413`: Payload too large (file too big)
- `415`: Unsupported media type (invalid file type)
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

## File Upload Implementation Notes

### Recommended Storage Solutions
1. **AWS S3** with encryption
2. **Google Cloud Storage** with encryption
3. **Azure Blob Storage** with encryption
4. **Local storage** (not recommended for production)

### File Upload Flow
1. Validate file (size, type, name)
2. Scan for malware (optional but recommended)
3. Generate unique filename
4. Encrypt file (if required)
5. Upload to cloud storage
6. Save metadata to database
7. Return document object

### File Download Flow
1. Verify user has access to patient
2. Retrieve document metadata from database
3. Verify document exists in storage
4. Decrypt file (if encrypted)
5. Stream file to user with proper headers

---

## Testing Checklist

- [ ] Create note with valid data
- [ ] Create note with missing required fields (should fail)
- [ ] Fetch all notes for a patient
- [ ] Update own note
- [ ] Try to update another user's note (should fail with 403)
- [ ] Delete own note
- [ ] Upload valid document (PDF, image)
- [ ] Upload document exceeding size limit (should fail)
- [ ] Upload invalid file type (should fail)
- [ ] Download document
- [ ] Delete document
- [ ] Test pagination for notes
- [ ] Test filtering by category for documents
- [ ] Test authentication failures (401)
- [ ] Test authorization failures (403)

---

## Priority Implementation

**Phase 1 (MVP)**:
1. POST /api/patients/:patientId/notes - Create note
2. GET /api/patients/:patientId/notes - List notes
3. POST /api/patients/:patientId/documents - Upload document
4. GET /api/patients/:patientId/documents - List documents
5. GET /api/patients/:patientId/documents/:documentId/download - Download document

**Phase 2 (Enhancement)**:
6. PUT /api/patients/:patientId/notes/:noteId - Update note
7. DELETE /api/patients/:patientId/notes/:noteId - Delete note
8. DELETE /api/patients/:patientId/documents/:documentId - Delete document
9. Advanced filtering and search

**Phase 3 (Advanced)**:
10. Document versioning
11. Note attachments
12. Document sharing
13. Advanced search with full-text search
14. Document preview (for images/PDFs)

---

## Summary

**Total Endpoints**: 12 (6 for notes, 6 for documents)
**Database Tables**: 2 (patient_notes, patient_documents)
**Key Features**: 
- Secure file upload with encryption
- Note management with privacy controls
- HIPAA-compliant document storage
- Access control and audit logging

