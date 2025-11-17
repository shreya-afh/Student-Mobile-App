# AFH Student Application - Integration API Documentation
## External Partner Integration APIs

**Version:** 1.0.0  
**Last Updated:** January 17, 2025  
**Base URL:** `https://ifafh-skilling.replit.app/api/partners/v1`

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication & Security](#authentication--security)
3. [Incoming APIs (External → AFH Student)](#incoming-apis)
   - [Push Job Opportunities](#1-push-job-opportunities)
4. [Outgoing APIs (AFH Student → External)](#outgoing-apis)
   - [Get Opportunity Applicants](#1-get-opportunity-applicants)
   - [Get Opportunity Metrics](#2-get-opportunity-metrics)
   - [List All Opportunities](#3-list-all-opportunities)
5. [Data Mapping & Visibility Rules](#data-mapping--visibility-rules)
6. [Error Handling](#error-handling)
7. [Rate Limits](#rate-limits)
8. [Testing & Examples](#testing--examples)

---

## Overview

### Integration Flow

The AFH Student Application integrates with external managing applications to:

1. **Receive Placement Opportunities** - External applications push job/internship opportunities to AFH Student
2. **Filter by College & Course** - Opportunities are shown only to eligible students based on college name and course code
3. **Track Applications** - External applications can retrieve student application data and metrics

### Key Features

- ✅ **College & Course-Based Filtering** - Opportunities visible only to matching students
- ✅ **Secure API Authentication** - HMAC-SHA256 request signing
- ✅ **Idempotent Operations** - Safe to retry requests
- ✅ **Real-time Application Tracking** - Get applicant lists and metrics
- ✅ **Bulk Operations** - Handle multiple opportunities in single request

---

## Authentication & Security

### API Key Authentication

All API requests must include an API key in the request headers.

**Headers Required:**
```
X-AFH-API-Key: afh_partner_live_your_secret_key_here
X-AFH-Signature: t=1234567890,v1=hmac_sha256_signature
Content-Type: application/json
```

### HMAC Request Signing

To prevent tampering and replay attacks, all requests must be signed using HMAC-SHA256.

**Signature Generation (Sender):**
```javascript
const crypto = require('crypto');

function generateAFHSignature(payload, sharedSecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  
  const signature = crypto
    .createHmac('sha256', sharedSecret)
    .update(signedPayload)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

// Usage Example
const payload = { 
  partnerId: "partner_infosys_001", 
  opportunities: [...] 
};
const sharedSecret = 'your_shared_secret_key';
const signature = generateAFHSignature(payload, sharedSecret);

// Add to headers
headers['X-AFH-API-Key'] = 'afh_partner_live_abc123xyz';
headers['X-AFH-Signature'] = signature;
```

**Signature Verification (Receiver):**
```javascript
function verifyAFHSignature(request, sharedSecret, tolerance = 300) {
  const signature = request.headers['x-afh-signature'];
  if (!signature) throw new Error('Missing signature');
  
  // Parse signature header
  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  const timestamp = parseInt(parts.t);
  const receivedSig = parts.v1;
  
  // Check timestamp (prevent replay attacks)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - timestamp) > tolerance) {
    throw new Error('Request timestamp expired');
  }
  
  // Verify signature
  const payload = request.rawBody; // or JSON.stringify(request.body)
  const expectedSig = crypto
    .createHmac('sha256', sharedSecret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig))) {
    throw new Error('Invalid signature');
  }
  
  return true;
}
```

### Security Best Practices

- ✅ **Always use HTTPS** - All API calls must use TLS 1.2 or higher
- ✅ **Store API keys securely** - Never commit keys to version control
- ✅ **Rotate keys regularly** - Recommended every 90 days
- ✅ **Validate timestamps** - Reject requests older than 5 minutes
- ✅ **Use idempotency keys** - Prevent duplicate processing
- ✅ **IP whitelisting** - Optional but recommended for production

---

## Incoming APIs

These APIs are called by the external managing application to send data to AFH Student.

### 1. Push Job Opportunities

Create or update job/internship opportunities in AFH Student. Opportunities are filtered and shown only to students matching the specified college and course criteria.

**Endpoint:**
```
POST /api/partners/v1/opportunities
```

**Request Headers:**
```
X-AFH-API-Key: afh_partner_live_xxxxx
X-AFH-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "partnerId": "partner_infosys_001",
  "opportunities": [
    {
      "externalOpportunityId": "opp_ext_12345",
      "title": "Software Developer Internship",
      "description": "6-month internship program for engineering students. Join our team to work on cutting-edge technologies including React, Node.js, and cloud infrastructure.",
      "company": "Tech Solutions India Pvt Ltd",
      "position": "Software Developer Intern",
      "mode": "hybrid",
      "locationType": "urban",
      "locationCity": "Bangalore",
      "locationState": "Karnataka",
      "locationDistrict": "Bangalore Urban",
      "stipend": "15000",
      "jobType": "internship",
      "startDate": "2025-07-01",
      "applicationDeadline": "2025-06-15",
      "applyUrl": "https://managing-app.com/apply/opp_ext_12345",
      "status": "active",
      "visibilityRules": [
        {
          "collegeName": "ABC Engineering College",
          "courseCode": "DM2024B4"
        },
        {
          "collegeName": "XYZ Institute of Technology",
          "courseCode": "DM2024B4"
        }
      ]
    },
    {
      "externalOpportunityId": "opp_ext_12346",
      "title": "Digital Marketing Associate",
      "description": "Full-time position for digital marketing graduates. Focus on SEO, social media marketing, and content strategy.",
      "company": "Digital Dynamics Agency",
      "position": "Digital Marketing Associate",
      "mode": "online",
      "locationType": "remote",
      "locationState": "Remote",
      "stipend": "25000",
      "jobType": "full-time",
      "startDate": "2025-06-01",
      "applicationDeadline": "2025-05-20",
      "applyUrl": "https://managing-app.com/apply/opp_ext_12346",
      "status": "active",
      "visibilityRules": [
        {
          "collegeName": "ABC Engineering College",
          "courseCode": "DM2024B4"
        }
      ]
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `partnerId` | string | Yes | Your partner organization ID (provided by AFH) |
| `opportunities` | array | Yes | Array of opportunity objects (max 50 per request) |
| `externalOpportunityId` | string | Yes | Unique ID from your system (used for idempotency) |
| `title` | string | Yes | Opportunity title (max 200 chars) |
| `description` | string | Yes | Detailed description (max 2000 chars) |
| `company` | string | Yes | Company name |
| `position` | string | Yes | Job position/role title |
| `mode` | string | Yes | `online`, `offline`, or `hybrid` |
| `locationType` | string | No | `rural`, `urban`, `semi-urban`, or `remote` |
| `locationCity` | string | No | City name |
| `locationState` | string | No | State name |
| `locationDistrict` | string | No | District name |
| `stipend` | string | No | Monthly stipend/salary in INR (e.g., "15000") |
| `jobType` | string | No | `full-time`, `part-time`, `internship`, `contract`, `apprenticeship` |
| `startDate` | string | No | Expected start date in YYYY-MM-DD format |
| `applicationDeadline` | string | Yes | Application deadline in YYYY-MM-DD format |
| `applyUrl` | string | Yes | URL where students apply (redirects to your system) |
| `status` | string | Yes | `active`, `closed`, or `draft` |
| `visibilityRules` | array | Yes | Array of college-course combinations (min 1) |
| `visibilityRules[].collegeName` | string | Yes | Exact college name (must match AFH records) |
| `visibilityRules[].courseCode` | string | Yes | Course code (e.g., "DM2024B4") |

**Important Notes:**
- **Idempotency:** If you send the same `externalOpportunityId` again, it will UPDATE the existing opportunity instead of creating a duplicate
- **Visibility:** Students will only see opportunities where BOTH their college name AND course code match a visibility rule
- **Case Sensitivity:** College names and course codes are matched case-insensitively
- **Apply URL:** When students click "Apply", they'll be redirected to your `applyUrl` with query params: `?studentId=AFH-0000001&opportunityId=opp_ext_12345`

**Success Response (200 OK):**
```json
{
  "status": "success",
  "processed": 2,
  "failed": 0,
  "results": [
    {
      "externalOpportunityId": "opp_ext_12345",
      "afhOpportunityId": "opp_afh_001",
      "action": "created",
      "message": "Opportunity created successfully",
      "visibleToStudents": 45,
      "matchingColleges": [
        "ABC Engineering College",
        "XYZ Institute of Technology"
      ]
    },
    {
      "externalOpportunityId": "opp_ext_12346",
      "afhOpportunityId": "opp_afh_002",
      "action": "created",
      "message": "Opportunity created successfully",
      "visibleToStudents": 23,
      "matchingColleges": [
        "ABC Engineering College"
      ]
    }
  ],
  "requestId": "req_abc123"
}
```

**Partial Success Response (207 Multi-Status):**
```json
{
  "status": "partial_success",
  "processed": 1,
  "failed": 1,
  "results": [
    {
      "externalOpportunityId": "opp_ext_12345",
      "afhOpportunityId": "opp_afh_001",
      "action": "updated",
      "message": "Opportunity updated successfully",
      "visibleToStudents": 45
    },
    {
      "externalOpportunityId": "opp_ext_12346",
      "action": "failed",
      "error": {
        "code": "INVALID_COURSE_CODE",
        "message": "Course code 'INVALID123' does not exist in AFH system",
        "field": "visibilityRules[0].courseCode",
        "value": "INVALID123"
      }
    }
  ],
  "requestId": "req_def456"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "opportunities[0].applicationDeadline",
        "message": "Application deadline must be a future date",
        "value": "2024-01-01"
      },
      {
        "field": "opportunities[1].visibilityRules",
        "message": "At least one visibility rule is required"
      }
    ]
  },
  "requestId": "req_ghi789"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key"
  },
  "requestId": "req_jkl012"
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Request signature verification failed"
  },
  "requestId": "req_mno345"
}
```

---

## Outgoing APIs

These APIs are called by the external managing application to retrieve data from AFH Student.

### 1. Get Opportunity Applicants

Retrieve the list of students who applied to a specific opportunity, including their contact details and application status.

**Endpoint:**
```
GET /api/partners/v1/opportunities/{externalOpportunityId}/applicants
```

**Request Headers:**
```
X-AFH-API-Key: afh_partner_live_xxxxx
X-AFH-Signature: t=1234567890,v1=abc123...
```

**Path Parameters:**
- `externalOpportunityId` - Your external opportunity ID (e.g., "opp_ext_12345")

**Query Parameters:**
```
?status=applied,accepted,rejected (optional filter, comma-separated)
&limit=100 (default: 100, max: 500)
&offset=0 (for pagination, default: 0)
```

**Example Request:**
```
GET /api/partners/v1/opportunities/opp_ext_12345/applicants?status=applied&limit=50&offset=0
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "externalOpportunityId": "opp_ext_12345",
  "afhOpportunityId": "opp_afh_001",
  "opportunityTitle": "Software Developer Internship",
  "company": "Tech Solutions India Pvt Ltd",
  "total": 25,
  "returned": 25,
  "applicants": [
    {
      "studentId": "AFH-0000001",
      "studentName": "Shreya Mishra",
      "email": "shreya.mishra@example.com",
      "phone": "8887566835",
      "whatsappNumber": "8887566835",
      "college": "ABC Engineering College",
      "courseCode": "DM2024B4",
      "courseName": "Digital Marketing Fundamentals",
      "city": "Bangalore",
      "state": "Karnataka",
      "district": "Bangalore Urban",
      "appliedAt": "2025-01-14T10:30:00Z",
      "applicationStatus": "applied"
    },
    {
      "studentId": "AFH-0000013",
      "studentName": "Rajesh Kumar",
      "email": "rajesh.kumar@example.com",
      "phone": "9876543210",
      "whatsappNumber": "9876543210",
      "college": "ABC Engineering College",
      "courseCode": "DM2024B4",
      "courseName": "Digital Marketing Fundamentals",
      "city": "Mumbai",
      "state": "Maharashtra",
      "district": "Mumbai",
      "appliedAt": "2025-01-14T11:15:00Z",
      "applicationStatus": "applied"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 25,
    "hasMore": false
  },
  "requestId": "req_pqr678"
}
```

**Field Descriptions (Applicants Array):**

| Field | Type | Description |
|-------|------|-------------|
| `studentId` | string | AFH Student ID (format: AFH-0000001) |
| `studentName` | string | Full name of the student |
| `email` | string | Email address |
| `phone` | string | Primary contact number |
| `whatsappNumber` | string | WhatsApp number |
| `college` | string | College/institution name |
| `courseCode` | string | Course code enrolled in |
| `courseName` | string | Full course name |
| `city` | string | City of residence |
| `state` | string | State of residence |
| `district` | string | District of residence |
| `appliedAt` | string | Application timestamp (ISO 8601) |
| `applicationStatus` | string | `applied`, `accepted`, or `rejected` |

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "error": {
    "code": "OPPORTUNITY_NOT_FOUND",
    "message": "Opportunity with ID 'opp_ext_99999' not found"
  },
  "requestId": "req_stu901"
}
```

---

### 2. Get Opportunity Metrics

Retrieve aggregated statistics and metrics for a specific opportunity without detailed student information.

**Endpoint:**
```
GET /api/partners/v1/opportunities/{externalOpportunityId}/metrics
```

**Request Headers:**
```
X-AFH-API-Key: afh_partner_live_xxxxx
X-AFH-Signature: t=1234567890,v1=abc123...
```

**Path Parameters:**
- `externalOpportunityId` - Your external opportunity ID (e.g., "opp_ext_12345")

**Example Request:**
```
GET /api/partners/v1/opportunities/opp_ext_12345/metrics
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "externalOpportunityId": "opp_ext_12345",
  "afhOpportunityId": "opp_afh_001",
  "opportunityTitle": "Software Developer Internship",
  "company": "Tech Solutions India Pvt Ltd",
  "metrics": {
    "totalApplicants": 25,
    "statusBreakdown": {
      "applied": 20,
      "accepted": 3,
      "rejected": 2
    },
    "collegeBreakdown": {
      "ABC Engineering College": 15,
      "XYZ Institute of Technology": 10
    },
    "courseBreakdown": {
      "DM2024B4": 18,
      "FS2024A1": 7
    },
    "locationBreakdown": {
      "Karnataka": 12,
      "Maharashtra": 8,
      "Tamil Nadu": 5
    },
    "genderBreakdown": {
      "female": 15,
      "male": 10
    }
  },
  "opportunityDetails": {
    "status": "active",
    "applicationDeadline": "2025-06-15",
    "visibleToStudents": 45,
    "createdAt": "2025-01-10T09:00:00Z"
  },
  "lastUpdated": "2025-01-14T15:30:00Z",
  "requestId": "req_vwx234"
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `totalApplicants` | number | Total number of applications |
| `statusBreakdown` | object | Count by application status |
| `collegeBreakdown` | object | Count by college |
| `courseBreakdown` | object | Count by course code |
| `locationBreakdown` | object | Count by state |
| `genderBreakdown` | object | Count by gender |
| `visibleToStudents` | number | Total students who can see this opportunity |
| `lastUpdated` | string | Last metrics calculation timestamp |

---

### 3. List All Opportunities

Retrieve all opportunities posted by your organization with summary statistics.

**Endpoint:**
```
GET /api/partners/v1/opportunities
```

**Request Headers:**
```
X-AFH-API-Key: afh_partner_live_xxxxx
X-AFH-Signature: t=1234567890,v1=abc123...
```

**Query Parameters:**
```
?status=active,closed,draft (optional filter, comma-separated, default: active)
&limit=50 (default: 50, max: 100)
&offset=0 (for pagination)
```

**Example Request:**
```
GET /api/partners/v1/opportunities?status=active&limit=20
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "partnerId": "partner_infosys_001",
  "total": 3,
  "returned": 3,
  "opportunities": [
    {
      "externalOpportunityId": "opp_ext_12345",
      "afhOpportunityId": "opp_afh_001",
      "title": "Software Developer Internship",
      "company": "Tech Solutions India Pvt Ltd",
      "position": "Software Developer Intern",
      "status": "active",
      "applicationDeadline": "2025-06-15",
      "totalApplicants": 25,
      "visibleToStudents": 45,
      "visibilityRuleCount": 2,
      "createdAt": "2025-01-10T09:00:00Z",
      "updatedAt": "2025-01-14T10:30:00Z"
    },
    {
      "externalOpportunityId": "opp_ext_12346",
      "afhOpportunityId": "opp_afh_002",
      "title": "Digital Marketing Associate",
      "company": "Digital Dynamics Agency",
      "position": "Digital Marketing Associate",
      "status": "active",
      "applicationDeadline": "2025-05-20",
      "totalApplicants": 12,
      "visibleToStudents": 23,
      "visibilityRuleCount": 1,
      "createdAt": "2025-01-12T14:00:00Z",
      "updatedAt": "2025-01-12T14:00:00Z"
    },
    {
      "externalOpportunityId": "opp_ext_12347",
      "afhOpportunityId": "opp_afh_003",
      "title": "Data Analyst Trainee",
      "company": "Analytics Pro Solutions",
      "position": "Data Analyst Trainee",
      "status": "closed",
      "applicationDeadline": "2025-01-05",
      "totalApplicants": 38,
      "visibleToStudents": 67,
      "visibilityRuleCount": 3,
      "createdAt": "2024-12-15T10:00:00Z",
      "updatedAt": "2025-01-06T09:00:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 3,
    "hasMore": false
  },
  "summary": {
    "totalActive": 2,
    "totalClosed": 1,
    "totalDraft": 0,
    "totalApplicantsAcrossAll": 75
  },
  "requestId": "req_yza567"
}
```

---

## Data Mapping & Visibility Rules

### College & Course Matching

**Critical:** Opportunity visibility is determined by exact matching of college name and course code.

**AFH Student Database Structure:**

| AFH Field | Type | Example | Your Field |
|-----------|------|---------|------------|
| `users.collegeName` | string | "ABC Engineering College" | `visibilityRules[].collegeName` |
| `courses.courseCode` | string | "DM2024B4" | `visibilityRules[].courseCode` |
| `courses.courseName` | string | "Digital Marketing Fundamentals" | (informational only) |

**Matching Logic:**
1. **Case-Insensitive:** "ABC Engineering College" matches "abc engineering college"
2. **Exact Match:** Partial matches are not supported
3. **AND Condition:** BOTH college AND course must match
4. **Multiple Rules:** Use OR logic - student matches ANY visibility rule

**Example Scenarios:**

**Scenario 1: Single College, Single Course**
```json
{
  "visibilityRules": [
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "DM2024B4"
    }
  ]
}
```
✅ Visible to: Students from "ABC Engineering College" enrolled in "DM2024B4"  
❌ Not visible to: Students from other colleges OR other courses

**Scenario 2: Multiple Colleges, Same Course**
```json
{
  "visibilityRules": [
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "DM2024B4"
    },
    {
      "collegeName": "XYZ Institute of Technology",
      "courseCode": "DM2024B4"
    }
  ]
}
```
✅ Visible to: Students from EITHER college, IF enrolled in "DM2024B4"

**Scenario 3: Same College, Multiple Courses**
```json
{
  "visibilityRules": [
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "DM2024B4"
    },
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "FS2024A1"
    }
  ]
}
```
✅ Visible to: Students from "ABC Engineering College" in EITHER course

### Student ID Format

**AFH Student IDs:**
- Format: `AFH-XXXXXXX` (e.g., `AFH-0000001`, `AFH-0000013`)
- Sequential numbering starting from AFH-0000001
- Always use this ID when tracking applicants in your system

### Apply URL Integration

When students click "Apply" on an opportunity, they are redirected to your `applyUrl` with query parameters:

**Redirect Format:**
```
{applyUrl}?studentId={afhStudentId}&opportunityId={externalOpportunityId}
```

**Example:**
```
https://managing-app.com/apply/opp_ext_12345?studentId=AFH-0000001&opportunityId=opp_ext_12345
```

**Your Application Should:**
1. Extract `studentId` and `opportunityId` from query params
2. Record the application in your system
3. Optionally call AFH Student webhook (if provided) to update application status

---

## Error Handling

### Standard Error Response Format

All errors follow this structure:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "field": "fieldName (if applicable)",
    "value": "invalid value (if applicable)"
  },
  "requestId": "req_unique_id"
}
```

### Error Codes

| HTTP Status | Error Code | Description | Resolution |
|-------------|------------|-------------|------------|
| **400** | `VALIDATION_ERROR` | Request payload validation failed | Check field requirements in error.details |
| **400** | `INVALID_COURSE_CODE` | Course code doesn't exist in AFH | Use valid course codes from AFH catalog |
| **400** | `INVALID_COLLEGE_NAME` | College name doesn't match any AFH records | Verify exact college name spelling |
| **400** | `PAST_DEADLINE` | Application deadline is in the past | Use future date for deadline |
| **400** | `MISSING_VISIBILITY_RULES` | No visibility rules provided | Add at least one visibility rule |
| **401** | `INVALID_API_KEY` | API key is invalid or expired | Check API key or request new one |
| **401** | `MISSING_API_KEY` | API key not provided in headers | Add X-AFH-API-Key header |
| **403** | `INVALID_SIGNATURE` | HMAC signature verification failed | Check signature generation logic |
| **403** | `TIMESTAMP_EXPIRED` | Request timestamp too old (>5 min) | Ensure clock synchronization |
| **403** | `UNAUTHORIZED_PARTNER` | Partner ID mismatch | Verify partnerId matches API key |
| **404** | `OPPORTUNITY_NOT_FOUND` | Opportunity doesn't exist | Check externalOpportunityId |
| **409** | `DUPLICATE_APPLICATION` | Student already applied | This is informational, not an error |
| **413** | `PAYLOAD_TOO_LARGE` | Request exceeds size limit | Reduce opportunities per request (<50) |
| **429** | `RATE_LIMIT_EXCEEDED` | Too many requests | Implement exponential backoff |
| **500** | `INTERNAL_ERROR` | Server error | Retry with exponential backoff |
| **503** | `SERVICE_UNAVAILABLE` | Temporary service disruption | Retry after specified seconds |

### Error Handling Best Practices

**1. Implement Retry Logic:**
```javascript
async function postOpportunityWithRetry(opportunity, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(opportunity)
      });
      
      if (response.ok) return await response.json();
      
      const error = await response.json();
      
      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(error.error.message);
      }
      
      // Retry server errors (5xx)
      if (i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // Exponential backoff
      }
    } catch (err) {
      if (i === maxRetries - 1) throw err;
    }
  }
}
```

**2. Handle Partial Success:**
```javascript
const response = await postOpportunities(opportunities);

if (response.status === 'partial_success') {
  // Log successful ones
  response.results
    .filter(r => r.action !== 'failed')
    .forEach(r => console.log(`✓ ${r.externalOpportunityId}`));
  
  // Handle failures
  response.results
    .filter(r => r.action === 'failed')
    .forEach(r => {
      console.error(`✗ ${r.externalOpportunityId}: ${r.error.message}`);
      // Optionally queue for manual review
    });
}
```

---

## Rate Limits

### Request Limits

| Endpoint | Rate Limit | Burst Limit |
|----------|------------|-------------|
| `POST /opportunities` | 60 requests/minute | 10 requests/second |
| `GET /opportunities/{id}/applicants` | 120 requests/minute | 20 requests/second |
| `GET /opportunities/{id}/metrics` | 120 requests/minute | 20 requests/second |
| `GET /opportunities` | 60 requests/minute | 10 requests/second |

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705234800
```

### Rate Limit Exceeded Response (429)

```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 30 seconds.",
    "retryAfter": 30
  },
  "requestId": "req_rate_001"
}
```

### Best Practices

1. **Respect Rate Limits:** Monitor `X-RateLimit-Remaining` header
2. **Implement Backoff:** Wait for `retryAfter` seconds before retrying
3. **Batch Operations:** Use bulk endpoints (max 50 opportunities per request)
4. **Cache Data:** Cache metrics/applicant lists to reduce API calls

---

## Testing & Examples

### Getting Started

**1. Obtain API Credentials**

Contact AFH Student support to receive:
```json
{
  "partnerId": "partner_your_org_001",
  "apiKey": "afh_partner_live_abc123xyz789",
  "sharedSecret": "secret_xyz789abc123",
  "sandboxUrl": "https://sandbox-afh-student.replit.app/api/partners/v1"
}
```

**2. Test Environment**

Use the sandbox URL for testing:
```
Sandbox Base URL: https://sandbox-afh-student.replit.app/api/partners/v1
Production Base URL: https://ifafh-skilling.replit.app/api/partners/v1
```

### Example 1: Post Single Opportunity

**cURL Example:**
```bash
curl -X POST "https://ifafh-skilling.replit.app/api/partners/v1/opportunities" \
  -H "X-AFH-API-Key: afh_partner_live_abc123xyz789" \
  -H "X-AFH-Signature: t=1705234800,v1=abcdef123456..." \
  -H "Content-Type: application/json" \
  -d '{
    "partnerId": "partner_infosys_001",
    "opportunities": [
      {
        "externalOpportunityId": "opp_test_001",
        "title": "Test Internship",
        "description": "This is a test opportunity",
        "company": "Test Company",
        "position": "Test Position",
        "mode": "hybrid",
        "stipend": "10000",
        "jobType": "internship",
        "applicationDeadline": "2025-12-31",
        "applyUrl": "https://example.com/apply",
        "status": "active",
        "visibilityRules": [
          {
            "collegeName": "ABC Engineering College",
            "courseCode": "DM2024B4"
          }
        ]
      }
    ]
  }'
```

**JavaScript/Node.js Example:**
```javascript
const crypto = require('crypto');

const partnerId = 'partner_infosys_001';
const apiKey = 'afh_partner_live_abc123xyz789';
const sharedSecret = 'secret_xyz789abc123';

const payload = {
  partnerId: partnerId,
  opportunities: [
    {
      externalOpportunityId: 'opp_test_001',
      title: 'Software Developer Internship',
      description: '6-month internship for engineering students',
      company: 'Tech Solutions India',
      position: 'Software Developer Intern',
      mode: 'hybrid',
      locationCity: 'Bangalore',
      locationState: 'Karnataka',
      stipend: '15000',
      jobType: 'internship',
      applicationDeadline: '2025-12-31',
      applyUrl: 'https://example.com/apply/opp_test_001',
      status: 'active',
      visibilityRules: [
        {
          collegeName: 'ABC Engineering College',
          courseCode: 'DM2024B4'
        }
      ]
    }
  ]
};

// Generate signature
function generateSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

const signature = generateSignature(payload, sharedSecret);

// Make API request
const response = await fetch(
  'https://ifafh-skilling.replit.app/api/partners/v1/opportunities',
  {
    method: 'POST',
    headers: {
      'X-AFH-API-Key': apiKey,
      'X-AFH-Signature': signature,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
);

const result = await response.json();
console.log(result);
```

**Python Example:**
```python
import hashlib
import hmac
import json
import time
import requests

partner_id = 'partner_infosys_001'
api_key = 'afh_partner_live_abc123xyz789'
shared_secret = 'secret_xyz789abc123'

payload = {
    'partnerId': partner_id,
    'opportunities': [
        {
            'externalOpportunityId': 'opp_test_001',
            'title': 'Software Developer Internship',
            'description': '6-month internship for engineering students',
            'company': 'Tech Solutions India',
            'position': 'Software Developer Intern',
            'mode': 'hybrid',
            'locationCity': 'Bangalore',
            'stipend': '15000',
            'jobType': 'internship',
            'applicationDeadline': '2025-12-31',
            'applyUrl': 'https://example.com/apply/opp_test_001',
            'status': 'active',
            'visibilityRules': [
                {
                    'collegeName': 'ABC Engineering College',
                    'courseCode': 'DM2024B4'
                }
            ]
        }
    ]
}

# Generate signature
def generate_signature(payload, secret):
    timestamp = int(time.time())
    payload_string = json.dumps(payload)
    signed_payload = f"{timestamp}.{payload_string}"
    signature = hmac.new(
        secret.encode('utf-8'),
        signed_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return f"t={timestamp},v1={signature}"

signature = generate_signature(payload, shared_secret)

# Make API request
response = requests.post(
    'https://ifafh-skilling.replit.app/api/partners/v1/opportunities',
    headers={
        'X-AFH-API-Key': api_key,
        'X-AFH-Signature': signature,
        'Content-Type': 'application/json'
    },
    json=payload
)

print(response.json())
```

### Example 2: Get Applicants

**cURL Example:**
```bash
curl -X GET "https://ifafh-skilling.replit.app/api/partners/v1/opportunities/opp_test_001/applicants?limit=10" \
  -H "X-AFH-API-Key: afh_partner_live_abc123xyz789" \
  -H "X-AFH-Signature: t=1705234800,v1=abcdef123456..."
```

**JavaScript Example:**
```javascript
const opportunityId = 'opp_test_001';
const url = `https://ifafh-skilling.replit.app/api/partners/v1/opportunities/${opportunityId}/applicants?limit=50`;

// Generate signature for GET request (empty body)
const signature = generateSignature({}, sharedSecret);

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'X-AFH-API-Key': apiKey,
    'X-AFH-Signature': signature
  }
});

const applicants = await response.json();
console.log(`Total applicants: ${applicants.total}`);
applicants.applicants.forEach(applicant => {
  console.log(`- ${applicant.studentName} (${applicant.studentId})`);
});
```

### Example 3: Get Metrics

**cURL Example:**
```bash
curl -X GET "https://ifafh-skilling.replit.app/api/partners/v1/opportunities/opp_test_001/metrics" \
  -H "X-AFH-API-Key: afh_partner_live_abc123xyz789" \
  -H "X-AFH-Signature: t=1705234800,v1=abcdef123456..."
```

### Testing Checklist

Before going to production, verify:

- [ ] Successfully authenticate with API key and signature
- [ ] Post test opportunity with valid visibility rules
- [ ] Verify opportunity appears to matching students only
- [ ] Test opportunity update (same externalOpportunityId)
- [ ] Retrieve applicant list
- [ ] Get metrics/statistics
- [ ] Handle rate limits gracefully
- [ ] Implement retry logic for 5xx errors
- [ ] Validate all error responses (400, 401, 403, 404)
- [ ] Test with expired timestamp (signature validation)
- [ ] Verify HTTPS/TLS connection

---

## Support & Contact

For API integration support, credentials, or technical assistance:

- **Email:** api-support@afhstudent.org
- **Slack Channel:** #afh-partner-integration
- **Documentation:** https://docs.afhstudent.org/integrations
- **Status Page:** https://status.afhstudent.org

---

## Changelog

### Version 1.0.0 (January 17, 2025)
- Initial API release
- Added opportunity push endpoint
- Added applicant retrieval endpoints
- Added metrics endpoint
- Implemented HMAC-SHA256 authentication
- Added college & course visibility filtering

---

**© 2025 AFH Student Application. All rights reserved.**
