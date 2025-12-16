# Backend API Specification for Custom Reports System

## Overview
This document provides the complete specification for building the backend API endpoints required for the custom reports feature in the LMN8 Dashboard.

---

## Base URL
All endpoints should be prefixed with your API base URL, for example:
```
https://your-api-domain.com/api
```

---

## Authentication
All endpoints require authentication using session tokens or JWT tokens. Include the authentication token in:
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

## API Endpoints

### 1. GET /api/reports
**Description**: Fetch all saved reports for the authenticated user

**Request**:
- Method: `GET`
- Authentication: Required
- Query Parameters: None

**Response (200 - Success)**:
```json
{
  "reports": [
    {
      "id": "uuid-or-int",
      "name": "Monthly Patient Summary",
      "description": "Overview of patient statistics for the month",
      "reportType": "summary",
      "dataSource": "patients",
      "metrics": ["total_patients", "active_patients", "new_patients"],
      "filters": {
        "dateRange": "last_30_days",
        "startDate": null,
        "endDate": null,
        "status": "all",
        "therapist": "all",
        "diagnosis": "all"
      },
      "groupBy": "status",
      "chartType": "bar",
      "columns": [],
      "sortBy": "date",
      "sortOrder": "desc",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "userId": "user-id"
    }
  ],
  "total": 5
}
```

**Response (500 - Error)**:
```json
{
  "error": "Internal server error",
  "message": "Failed to fetch reports"
}
```

---

### 2. POST /api/reports
**Description**: Create a new custom report configuration

**Request**:
- Method: `POST`
- Authentication: Required
- Content-Type: `application/json`

**Request Body**:
```json
{
  "name": "Weekly Patient Report",
  "description": "Patient statistics for the week",
  "reportType": "summary",
  "dataSource": "patients",
  "metrics": ["total_patients", "active_patients", "new_patients"],
  "filters": {
    "dateRange": "last_7_days",
    "startDate": "",
    "endDate": "",
    "status": "active",
    "therapist": "all",
    "diagnosis": "all"
  },
  "groupBy": "status",
  "chartType": "bar",
  "columns": [],
  "sortBy": "date",
  "sortOrder": "desc"
}
```

**Field Definitions**:
- `name` (string, required): Report name
- `description` (string, optional): Report description
- `reportType` (enum, required): One of: `summary`, `detailed`, `trend`, `custom`
- `dataSource` (enum, required): One of: `patients`, `sessions`, `demographics`, `outcomes`
- `metrics` (array, required): Array of metric IDs to include (see Metric IDs section)
- `filters` (object, required): Filter configuration
  - `dateRange` (enum): `last_7_days`, `last_30_days`, `last_90_days`, `custom`, `all_time`
  - `startDate` (string/date): Start date if dateRange is `custom`
  - `endDate` (string/date): End date if dateRange is `custom`
  - `status` (string): `all`, `active`, `completed`, `inactive`
  - `therapist` (string): `all` or specific therapist ID
  - `diagnosis` (string): `all` or specific diagnosis
- `groupBy` (enum, required): `none`, `therapist`, `status`, `diagnosis`, `month`, `week`
- `chartType` (enum, required): `bar`, `line`, `pie`, `table`, `mixed`
- `columns` (array, optional): Column configuration for table reports
- `sortBy` (string, optional): Field to sort by
- `sortOrder` (enum, optional): `asc` or `desc`

**Response (201 - Success)**:
```json
{
  "success": true,
  "message": "Report created successfully",
  "report": {
    "id": "generated-report-id",
    "name": "Weekly Patient Report",
    "description": "Patient statistics for the week",
    "reportType": "summary",
    "dataSource": "patients",
    "metrics": ["total_patients", "active_patients", "new_patients"],
    "filters": { /* ... */ },
    "groupBy": "status",
    "chartType": "bar",
    "columns": [],
    "sortBy": "date",
    "sortOrder": "desc",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "userId": "user-id"
  }
}
```

**Response (400 - Validation Error)**:
```json
{
  "error": "Validation error",
  "message": "Name and at least one metric are required",
  "details": {
    "name": "Report name is required",
    "metrics": "At least one metric must be selected"
  }
}
```

---

### 3. GET /api/reports/:id
**Description**: Get a specific report configuration

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: `id` (report ID)

**Response (200 - Success)**:
```json
{
  "report": {
    "id": "report-id",
    "name": "Weekly Patient Report",
    "description": "Patient statistics for the week",
    "reportType": "summary",
    "dataSource": "patients",
    "metrics": ["total_patients", "active_patients"],
    "filters": { /* ... */ },
    "groupBy": "status",
    "chartType": "bar",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (404 - Not Found)**:
```json
{
  "error": "Report not found",
  "message": "Report with ID 'report-id' does not exist"
}
```

---

### 4. PUT /api/reports/:id
**Description**: Update an existing report configuration

**Request**:
- Method: `PUT`
- Authentication: Required
- Content-Type: `application/json`
- URL Parameters: `id` (report ID)

**Request Body**: Same structure as POST /api/reports

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Report updated successfully",
  "report": { /* updated report object */ }
}
```

---

### 5. DELETE /api/reports/:id
**Description**: Delete a report

**Request**:
- Method: `DELETE`
- Authentication: Required
- URL Parameters: `id` (report ID)

**Response (200 - Success)**:
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

**Response (404 - Not Found)**:
```json
{
  "error": "Report not found",
  "message": "Report with ID 'report-id' does not exist"
}
```

---

### 6. POST /api/reports/:id/generate
**Description**: Generate report data based on the report configuration

**Request**:
- Method: `POST`
- Authentication: Required
- URL Parameters: `id` (report ID)

**Response (200 - Success)**:
```json
{
  "reportId": "report-id",
  "reportName": "Weekly Patient Report",
  "generatedAt": "2024-01-20T15:45:00Z",
  "dateRange": {
    "start": "2024-01-13T00:00:00Z",
    "end": "2024-01-20T23:59:59Z"
  },
  "summary": [
    {
      "label": "Total Patients",
      "value": 150,
      "change": 5.2,
      "changeType": "increase"
    },
    {
      "label": "Active Patients",
      "value": 120,
      "change": -2.1,
      "changeType": "decrease"
    },
    {
      "label": "New Patients",
      "value": 15,
      "change": 25.0,
      "changeType": "increase"
    }
  ],
  "chartData": {
    "labels": ["Active", "Completed", "Inactive"],
    "datasets": [
      {
        "label": "Patient Count",
        "data": [120, 25, 5],
        "backgroundColor": ["#3b82f6", "#10b981", "#ef4444"]
      }
    ]
  },
  "tableData": {
    "headers": ["Name", "Status", "Therapist", "Sessions", "Last Visit"],
    "rows": [
      ["John Doe", "Active", "Dr. Smith", "5/12", "2024-01-18"],
      ["Jane Smith", "Active", "Dr. Johnson", "8/12", "2024-01-19"]
    ]
  },
  "additionalData": [
    {
      "title": "Key Insight",
      "description": "New patient intake increased by 25% compared to last week"
    },
    {
      "title": "Trend",
      "description": "Active patient retention rate is at 95%"
    }
  ]
}
```

**Response Structure Details**:
- `summary`: Array of key metrics with values and percentage changes
- `chartData`: Data formatted for Chart.js or similar libraries
  - For bar/line charts: Use labels and datasets
  - For pie charts: Same structure works
- `tableData`: Raw tabular data
  - `headers`: Array of column headers
  - `rows`: 2D array of row data
- `additionalData`: Array of insights or notable findings

**Response (404 - Not Found)**:
```json
{
  "error": "Report not found",
  "message": "Report with ID 'report-id' does not exist"
}
```

**Response (500 - Generation Error)**:
```json
{
  "error": "Failed to generate report",
  "message": "Error calculating metrics",
  "details": "Specific error details"
}
```

---

### 7. GET /api/reports/:id/export
**Description**: Export report data in various formats

**Request**:
- Method: `GET`
- Authentication: Required
- URL Parameters: `id` (report ID)
- Query Parameters:
  - `format` (required): `csv`, `pdf`, `excel`, or `json`

**Examples**:
```
GET /api/reports/123/export?format=csv
GET /api/reports/123/export?format=pdf
```

**Response (200 - Success)**:
- Content-Type: Depends on format
  - CSV: `text/csv`
  - PDF: `application/pdf`
  - Excel: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - JSON: `application/json`
- Content-Disposition: `attachment; filename="report_name_2024-01-20.{format}"`
- Body: File content in binary or text format

**CSV Example**:
```csv
Name,Status,Therapist,Sessions,Last Visit
John Doe,Active,Dr. Smith,5/12,2024-01-18
Jane Smith,Active,Dr. Johnson,8/12,2024-01-19
```

**Response (400 - Invalid Format)**:
```json
{
  "error": "Invalid format",
  "message": "Format must be one of: csv, pdf, excel, json"
}
```

---

## Metric IDs Reference

### Patients Data Source
- `total_patients`: Total count of all patients
- `active_patients`: Count of active patients
- `new_patients`: Patients added in date range
- `completed_patients`: Patients who completed treatment
- `inactive_patients`: Patients marked as inactive
- `average_age`: Mean age of patients
- `gender_distribution`: Breakdown by gender

### Sessions Data Source
- `total_sessions`: Total count of sessions
- `completed_sessions`: Successfully completed sessions
- `average_sessions_per_patient`: Mean sessions per patient
- `session_completion_rate`: Percentage of completed sessions
- `sessions_by_therapist`: Breakdown by therapist

### Demographics Data Source
- `diagnosis_distribution`: Breakdown by diagnosis
- `age_groups`: Patients grouped by age ranges
- `geographic_distribution`: Patients by location

### Outcomes Data Source
- `treatment_outcomes`: Success rates and outcomes
- `progress_trends`: Patient progress over time
- `retention_rate`: Patient retention percentage

---

## Database Schema Suggestion

### reports table
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  report_type VARCHAR(50) NOT NULL,
  data_source VARCHAR(50) NOT NULL,
  metrics JSONB NOT NULL,
  filters JSONB NOT NULL,
  group_by VARCHAR(50),
  chart_type VARCHAR(50) NOT NULL,
  columns JSONB,
  sort_by VARCHAR(50),
  sort_order VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_reports_user_id (user_id),
  INDEX idx_reports_created_at (created_at DESC)
);
```

### report_executions table (optional - for tracking report generation history)
```sql
CREATE TABLE report_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  execution_time_ms INT,
  status VARCHAR(50),
  result_summary JSONB,
  
  INDEX idx_executions_report_id (report_id),
  INDEX idx_executions_executed_at (executed_at DESC)
);
```

---

## Business Logic Requirements

### Date Range Calculation
When `filters.dateRange` is specified:
- `last_7_days`: Today - 6 days to today (inclusive)
- `last_30_days`: Today - 29 days to today (inclusive)
- `last_90_days`: Today - 89 days to today (inclusive)
- `custom`: Use `filters.startDate` and `filters.endDate`
- `all_time`: No date filtering

### Metric Calculations

**Example for `total_patients`**:
```sql
SELECT COUNT(DISTINCT id) 
FROM patients 
WHERE user_id = $1 
  AND created_at BETWEEN $2 AND $3
  AND (status = $4 OR $4 = 'all');
```

**Example for `active_patients`**:
```sql
SELECT COUNT(DISTINCT id) 
FROM patients 
WHERE user_id = $1 
  AND status = 'active'
  AND created_at BETWEEN $2 AND $3;
```

**Percentage Change Calculation**:
Compare current period to previous period of equal length:
```
change = ((current_value - previous_value) / previous_value) * 100
```

### Grouping Logic
When `groupBy` is specified:
- Group the data by that field
- Return aggregated counts/metrics per group
- Sort by group name or count (configurable)

### Chart Data Format
Return data in Chart.js compatible format for easy frontend integration.

---

## Error Handling

All endpoints should return appropriate HTTP status codes:
- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation error
- `401`: Unauthorized / Not authenticated
- `403`: Forbidden / Insufficient permissions
- `404`: Resource not found
- `500`: Internal server error

Always include descriptive error messages and details where applicable.

---

## Performance Considerations

1. **Caching**: Consider caching frequently accessed report data for 5-15 minutes
2. **Pagination**: For large datasets in table view, implement pagination
3. **Async Generation**: For complex reports, consider async processing with webhooks
4. **Rate Limiting**: Implement rate limiting on generate endpoint (e.g., 10 requests per minute per user)
5. **Indexing**: Ensure proper database indexes on frequently queried fields (user_id, dates, status)

---

## Testing Checklist

- [ ] Create report with valid data
- [ ] Create report with missing required fields (should fail)
- [ ] Fetch all reports for authenticated user
- [ ] Fetch specific report by ID
- [ ] Update report configuration
- [ ] Delete report
- [ ] Generate report with various date ranges
- [ ] Generate report with different grouping options
- [ ] Export report in CSV format
- [ ] Export report in PDF format
- [ ] Test authentication failures
- [ ] Test permission checks (user can only access their own reports)
- [ ] Test with large datasets (performance)

---

## Implementation Priority

**Phase 1 (MVP)**:
1. POST /api/reports (create)
2. GET /api/reports (list all)
3. POST /api/reports/:id/generate (generate data)
4. DELETE /api/reports/:id (delete)

**Phase 2 (Enhancement)**:
5. GET /api/reports/:id (get single)
6. PUT /api/reports/:id (update)
7. GET /api/reports/:id/export (CSV only)

**Phase 3 (Advanced)**:
8. Export in PDF and Excel formats
9. Report execution history tracking
10. Scheduled reports
11. Report sharing between users

---

## Example Use Case Flow

1. User clicks "Create Report" in dashboard
2. Frontend sends POST request to `/api/reports` with configuration
3. Backend validates and saves report, returns report ID
4. Frontend displays report in saved reports list
5. User clicks on saved report
6. Frontend sends POST request to `/api/reports/:id/generate`
7. Backend:
   - Fetches report configuration
   - Applies filters to data
   - Calculates metrics
   - Groups data if needed
   - Formats response
8. Frontend receives data and renders visualization
9. User clicks "Export CSV"
10. Frontend sends GET request to `/api/reports/:id/export?format=csv`
11. Backend generates CSV and returns as download
12. Browser downloads the file

---

## Security Considerations

1. **Authorization**: Ensure users can only access/modify their own reports
2. **Input Validation**: Sanitize all input to prevent SQL injection
3. **Rate Limiting**: Prevent abuse of generate endpoint
4. **Data Privacy**: Ensure sensitive patient data is properly protected
5. **Audit Logging**: Log report access and generation for compliance

---

## Support & Questions

For implementation questions or clarifications, please contact the frontend team or refer to the frontend implementation in `src/components/pages/ReportsContent.js`.

