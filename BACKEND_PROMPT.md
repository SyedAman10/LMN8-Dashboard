# Backend Development Prompt for Custom Reports API

## Quick Summary
Build a RESTful API for a custom reports system that allows users to create, save, and generate data reports with various filters, metrics, and export options.

## Core Requirements

### 1. API Endpoints to Build (7 endpoints)

```
GET    /api/reports              - List all saved reports for user
POST   /api/reports              - Create new report configuration
GET    /api/reports/:id          - Get specific report
PUT    /api/reports/:id          - Update report configuration
DELETE /api/reports/:id          - Delete report
POST   /api/reports/:id/generate - Generate report data
GET    /api/reports/:id/export   - Export report (CSV/PDF)
```

### 2. Report Configuration Schema

```javascript
{
  name: string (required),
  description: string,
  reportType: "summary" | "detailed" | "trend" | "custom",
  dataSource: "patients" | "sessions" | "demographics" | "outcomes",
  metrics: string[], // Array of metric IDs like ["total_patients", "active_patients"]
  filters: {
    dateRange: "last_7_days" | "last_30_days" | "last_90_days" | "custom" | "all_time",
    startDate: date,
    endDate: date,
    status: "all" | "active" | "completed" | "inactive",
    therapist: string,
    diagnosis: string
  },
  groupBy: "none" | "therapist" | "status" | "diagnosis" | "month" | "week",
  chartType: "bar" | "line" | "pie" | "table" | "mixed",
  sortBy: string,
  sortOrder: "asc" | "desc"
}
```

### 3. Generate Report Response Format

```javascript
{
  reportId: string,
  reportName: string,
  generatedAt: timestamp,
  dateRange: { start: date, end: date },
  
  // Key metrics with percentage changes
  summary: [
    {
      label: "Total Patients",
      value: 150,
      change: 5.2,  // Percentage change from previous period
      changeType: "increase" | "decrease"
    }
  ],
  
  // Chart.js compatible format
  chartData: {
    labels: ["Active", "Completed", "Inactive"],
    datasets: [{
      label: "Patient Count",
      data: [120, 25, 5],
      backgroundColor: ["#3b82f6", "#10b981", "#ef4444"]
    }]
  },
  
  // For table views
  tableData: {
    headers: ["Name", "Status", "Therapist", "Sessions"],
    rows: [
      ["John Doe", "Active", "Dr. Smith", "5/12"],
      ["Jane Smith", "Completed", "Dr. Johnson", "12/12"]
    ]
  },
  
  // Additional insights
  additionalData: [
    {
      title: "Key Insight",
      description: "New patient intake increased by 25%"
    }
  ]
}
```

### 4. Available Metrics by Data Source

**Patients:**
- `total_patients`, `active_patients`, `new_patients`, `completed_patients`, `inactive_patients`, `average_age`, `gender_distribution`

**Sessions:**
- `total_sessions`, `completed_sessions`, `average_sessions_per_patient`, `session_completion_rate`, `sessions_by_therapist`

**Demographics:**
- `diagnosis_distribution`, `age_groups`, `geographic_distribution`

**Outcomes:**
- `treatment_outcomes`, `progress_trends`, `retention_rate`

### 5. Key Business Logic

**Date Range:**
- `last_7_days`: Last 7 days including today
- `last_30_days`: Last 30 days including today
- `custom`: Use provided startDate and endDate

**Percentage Change:**
- Compare current period metrics to previous equal period
- Formula: `((current - previous) / previous) * 100`

**Grouping:**
- When groupBy is set, aggregate data by that field
- Return counts/metrics per group

### 6. Authentication
- All endpoints require user authentication (session token or JWT)
- Users can only access their own reports
- Return 401 for unauthenticated requests

### 7. Database Schema

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  report_type VARCHAR(50),
  data_source VARCHAR(50),
  metrics JSONB,
  filters JSONB,
  group_by VARCHAR(50),
  chart_type VARCHAR(50),
  columns JSONB,
  sort_by VARCHAR(50),
  sort_order VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8. Export Functionality

Support exporting reports in:
- **CSV**: Plain text, comma-separated
- **PDF**: Formatted document with charts
- **JSON**: Raw data format

Return as downloadable file with proper Content-Type and Content-Disposition headers.

### 9. Error Handling

Return proper HTTP status codes:
- 200: Success
- 201: Created
- 400: Validation error
- 401: Unauthorized
- 404: Not found
- 500: Server error

Always include error messages:
```javascript
{
  error: "Error type",
  message: "Human readable message",
  details: "Specific error details (optional)"
}
```

### 10. Performance Requirements

- Cache report data for 5-15 minutes
- Add database indexes on user_id, created_at, status
- Implement rate limiting (10 requests/minute per user on generate endpoint)
- For large datasets, implement pagination

---

## Implementation Example

**Create Report:**
```javascript
POST /api/reports
{
  "name": "Weekly Patient Summary",
  "dataSource": "patients",
  "metrics": ["total_patients", "active_patients"],
  "filters": {
    "dateRange": "last_7_days",
    "status": "all"
  },
  "chartType": "bar"
}

// Response
{
  "success": true,
  "report": { id: "123", name: "Weekly Patient Summary", ... }
}
```

**Generate Report:**
```javascript
POST /api/reports/123/generate

// Response includes summary, chartData, tableData as specified above
```

---

## Testing Requirements

Test these scenarios:
1. ✅ Create report with valid data
2. ✅ Create report with missing required fields (should fail with 400)
3. ✅ Generate report with different date ranges
4. ✅ Generate report with grouping
5. ✅ Export report as CSV
6. ✅ Authentication failures (401)
7. ✅ User can only access their own reports
8. ✅ Performance with large datasets

---

## Priority

**Phase 1 (MVP - Build These First):**
1. POST /api/reports - Create report
2. GET /api/reports - List reports
3. POST /api/reports/:id/generate - Generate report data
4. DELETE /api/reports/:id - Delete report

**Phase 2 (Later):**
5. GET /api/reports/:id - Get single report
6. PUT /api/reports/:id - Update report
7. GET /api/reports/:id/export - Export functionality

---

## Full API Documentation

See `BACKEND_API_SPECIFICATION.md` for complete details including:
- Detailed request/response examples
- All metric calculations
- Complete database schema
- Security considerations
- Performance optimization tips

---

## Questions?

Refer to the frontend implementation in `src/components/pages/ReportsContent.js` to see how the API will be consumed.

