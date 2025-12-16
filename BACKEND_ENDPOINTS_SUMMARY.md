# Backend Endpoints Summary for Patient Notes & Documents

## Quick Reference

You have implemented **12 API endpoints** for patient notes and document management:

---

## Patient Notes Endpoints (6)

### 1. GET /api/patients/:patientId/notes
**Purpose**: Fetch all notes for a patient
- Returns: Array of notes with author info, timestamps, tags
- Query params: `limit`, `offset`, `sortBy`, `sortOrder`

### 2. POST /api/patients/:patientId/notes
**Purpose**: Create a new note
- Body: `{ note, noteType, isPrivate, tags }`
- Returns: Created note object

### 3. PUT /api/patients/:patientId/notes/:noteId
**Purpose**: Update a note
- Body: Same as POST (partial updates allowed)
- Returns: Updated note object
- **Security**: Users can only edit their own notes

### 4. DELETE /api/backend/patients/:patientId/notes/:noteId
**Purpose**: Delete a note
- Returns: Success message
- **Security**: Users can only delete their own notes

### 5. GET /api/backend/patients/:patientId/notes/:noteId
**Purpose**: Get a specific note by ID
- Returns: Single note object

### 6. GET /api/backend/patients/:patientId/notes/search
**Purpose**: Search notes
- Query params: `q` (search query), `noteType`, `tags`, `limit`, `offset`
- Returns: Array of matching notes

---

## Patient Documents Endpoints (6)

### 7. GET /api/backend/patients/:patientId/documents
**Purpose**: List all documents for a patient
- Returns: Array of documents with file info, size, category
- Query params: `category`, `limit`, `offset`

### 8. POST /api/backend/patients/:patientId/documents
**Purpose**: Upload a document
- **Content-Type**: `multipart/form-data`
- Form fields: `file` (required), `category`, `description`, `tags`
- **File validation**: Max 10MB, types: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
- **Storage**: Upload to cloud storage (AWS S3, Google Cloud, etc.)
- **Encryption**: Encrypt files at rest
- Returns: Document metadata object

### 9. GET /api/backend/patients/:patientId/documents/:documentId
**Purpose**: Get document metadata
- Returns: Single document object with all metadata

### 10. GET /api/backend/patients/:patientId/documents/:documentId/download
**Purpose**: Download a document
- Returns: File binary with proper headers
- Headers: `Content-Type`, `Content-Disposition`

### 11. PUT /api/backend/patients/:patientId/documents/:documentId
**Purpose**: Update document metadata (category, description, tags)
- Body: `{ category, description, tags }`
- Returns: Updated document object

### 12. DELETE /api/backend/patients/:patientId/documents/:documentId
**Purpose**: Delete a document
- **Important**: Also delete file from storage
- Returns: Success message

---

## Database Tables Needed

### patient_notes
```sql
- id (UUID)
- patient_id (UUID, FK to patients)
- author_id (UUID, FK to users)
- note (TEXT)
- note_type (VARCHAR) - 'clinical', 'session', 'general', 'followup'
- is_private (BOOLEAN)
- tags (TEXT[])
- created_at, updated_at
```

### patient_documents
```sql
- id (UUID)
- patient_id (UUID, FK to patients)
- uploaded_by_id (UUID, FK to users)
- file_name (VARCHAR)
- original_file_name (VARCHAR)
- file_size (BIGINT)
- file_type / mime_type (VARCHAR)
- category (VARCHAR) - 'lab-results', 'medical-records', 'consent-forms', 'insurance', 'other'
- description (TEXT)
- tags (TEXT[])
- storage_path (VARCHAR) - Path in cloud storage
- storage_url (VARCHAR) - Public URL if needed
- is_encrypted (BOOLEAN)
- encryption_key (VARCHAR)
- created_at, updated_at
```

---

## Key Requirements

### Security
- ✅ All endpoints require authentication
- ✅ Users can only access patients they have permission for
- ✅ Notes: Users can only edit/delete their own notes
- ✅ Documents: Encrypt at rest, secure storage
- ✅ HIPAA compliance for patient data

### File Upload
- ✅ Max file size: 10MB
- ✅ Allowed types: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
- ✅ Validate file type and size before upload
- ✅ Store in cloud storage (AWS S3, Google Cloud Storage, Azure Blob)
- ✅ Generate unique filenames
- ✅ Track uploader and timestamp

### Notes
- ✅ Support tags for categorization
- ✅ Private notes (only visible to author)
- ✅ Different note types (clinical, session, general, followup)
- ✅ Track author and timestamps

---

## Complete API Documentation

See `PATIENT_NOTES_DOCUMENTS_API.md` for:
- Complete request/response examples
- Detailed field definitions
- Error handling
- Database schema with indexes
- Security considerations
- File upload implementation guide

---

## Priority Order

**All Endpoints Implemented** ✅:
1. GET /api/backend/patients/:patientId/notes - List notes
2. GET /api/backend/patients/:patientId/notes/:noteId - Get specific note
3. POST /api/backend/patients/:patientId/notes - Create note
4. PUT /api/backend/patients/:patientId/notes/:noteId - Update note
5. DELETE /api/backend/patients/:patientId/notes/:noteId - Delete note
6. GET /api/backend/patients/:patientId/notes/search - Search notes
7. GET /api/backend/patients/:patientId/documents - List documents
8. GET /api/backend/patients/:patientId/documents/:documentId - Get document metadata
9. POST /api/backend/patients/:patientId/documents - Upload document
10. GET /api/backend/patients/:patientId/documents/:documentId/download - Download document
11. PUT /api/backend/patients/:patientId/documents/:documentId - Update document metadata
12. DELETE /api/backend/patients/:patientId/documents/:documentId - Delete document

---

## Example Request/Response

### Create Note
```javascript
POST /api/backend/patients/123/notes
{
  "note": "Patient showed progress in managing anxiety",
  "noteType": "clinical",
  "isPrivate": false,
  "tags": ["anxiety", "progress"]
}

Response (201):
{
  "success": true,
  "note": {
    "id": "uuid",
    "patientId": "123",
    "authorName": "Dr. Jane Smith",
    "note": "Patient showed progress...",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

### Upload Document
```javascript
POST /api/backend/patients/123/documents
Content-Type: multipart/form-data

Form Data:
- file: [binary file]
- category: "lab-results"
- description: "Blood test results"
- tags: "lab, blood-test"

Response (201):
{
  "success": true,
  "document": {
    "id": "uuid",
    "fileName": "lab-results-2024.pdf",
    "fileSize": 245760,
    "storageUrl": "https://storage.example.com/..."
  }
}
```

---

That's it! Build these 8 endpoints and the frontend will work perfectly. 🚀

