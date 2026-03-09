# Collaro API Documentation

This document describes all the API endpoints implemented in the Collaro application.

## Base URL

All API endpoints are prefixed with `/api`

---

## Authentication Routes

### POST/GET `/auth/[...all]`

**Description**: Better Auth authentication handler that manages all authentication operations (sign up, sign in, sign out, etc.)

**Method**: `POST`, `GET`

**Authentication**: None (handled by Better Auth)

**Implementation**: Delegated to `better-auth` library via `toNextJsHandler()`

**Example Endpoints**:

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user

---

### GET `/auth/me`

**Description**: Retrieve the current authenticated user's data

**Method**: `GET`

**Authentication**: Required (session-based)

**Parameters**: None

**Response** (Success - 200):

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "userName": "string",
    "email": "string"
  }
}
```

**Response** (Errors):

- **401 Unauthorized**: `{ "user": null, "error": "Not authenticated" }`
- **404 Not Found**: `{ "user": null, "error": "User not found" }`
- **500 Internal Server Error**: `{ "user": null, "error": "Internal server error" }`

---

## Health Check

### GET `/health`

**Description**: Health check endpoint to verify API is running

**Method**: `GET`

**Authentication**: None

**Parameters**: None

**Response** (Success - 200):

```json
{
  "success": true,
  "data": "OK"
}
```

**Response** (Error):

```json
{
  "success": false,
  "error": "error message"
}
```

---

## Inngest Integration

### GET/POST/PUT `/inngest`

**Description**: Webhook endpoint for Inngest background job processing

**Method**: `GET`, `POST`, `PUT`

**Authentication**: Inngest (webhook signature verification)

**Details**:

- Handles all Inngest triggered functions
- Serves Inngest dashboard and webhook management
- Managed by `inngest` library

---

## Meeting Routes

### GET `/meeting/{slug}`

**Description**: Retrieve meetings for a workspace with pagination

**Method**: `GET`

**Authentication**: Not explicitly checked in code (may be checked upstream)

**URL Parameters**:

- `slug` (required, string): Workspace slug identifier

**Query Parameters**:

- `page` (required, string): Page number for pagination

**Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "meetingId": "string",
      "participants": [
        {
          "userId": "string",
          "name": "string"
        }
      ]
    }
  ]
}
```

**Response** (Errors):

- **400 Bad Request**: Missing `page` or `slug` parameter
- **404 Not Found**: Workspace with given slug not found
- **500 Internal Server Error**: Database or processing error

---

### POST `/meeting/new`

**Description**: Create a new meeting in Stream and store it in database

**Method**: `POST`

**Authentication**: Required (session-based)

**Request Body**:

```json
{
  "data": {
    "meetingId": "string" // Meeting ID from Stream
  }
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "id": "string",
    "meetingId": "string",
    "workspaceId": "string",
    "createdAt": "timestamp",
    "endedAt": null
  }
}
```

**Response** (Errors):

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: User or workspace not found
- **400 Bad Request**: Missing or invalid meeting ID
- **500 Internal Server Error**: Database error

---

### POST `/meeting/end`

**Description**: End an active meeting and update its status in database

**Method**: `POST`

**Authentication**: Required (session-based)

**Request Body**:

```json
{
  "meetingId": "string"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "id": "string",
    "meetingId": "string",
    "workspaceId": "string",
    "createdAt": "timestamp",
    "endedAt": "timestamp"
  }
}
```

**Response** (Errors):

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: User, workspace, or meeting not found
- **400 Bad Request**: Missing meeting ID
- **500 Internal Server Error**: Database error

---

## User Routes

### GET `/user/{id}`

**Description**: Retrieve a user and their associated workspace

**Method**: `GET`

**Authentication**: None (public endpoint)

**URL Parameters**:

- `id` (required, string): User ID

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "workspaceId": "string"
  }
}
```

**Response** (Errors):

- **404 Not Found**: `{ "success": false, "error": "User not found" }` or `{ "success": false, "error": "User not in a workspace" }`
- **500 Internal Server Error**: `{ "success": false, "error": "Failed to fetch workspace ID" }`

---

### GET `/user/me`

**Description**: Retrieve current authenticated user's profile and workspace information

**Method**: `GET`

**Authentication**: Required (session-based)

**Parameters**: None

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "clerkId": "string",
    "userId": "string",
    "name": "string",
    "userName": "string",
    "email": "string",
    "currentWorkspaceId": "string|null",
    "currentWorkspaceName": "string|null",
    "role": "admin|member"
  }
}
```

**Response** (Errors):

- **401 Unauthorized**: `{ "error": "Unauthorized" }`
- **404 Not Found**: `{ "error": "User not found in database" }`
- **500 Internal Server Error**: `{ "error": "Internal server error" }`

---

## Workspace Routes

### GET `/workspace/{slug}/members`

**Description**: Retrieve all members of a workspace with their user details

**Method**: `GET`

**Authentication**: Required (session-based)

**URL Parameters**:

- `slug` (required, string): Workspace slug identifier

**Response** (Success - 200):

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "workspaceId": "string",
      "role": "admin|member",
      "createdAt": "timestamp",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ]
}
```

**Response** (Errors):

- **400 Bad Request**: Missing slug parameter
- **404 Not Found**: Workspace not found
- **500 Internal Server Error**: Database error

---

### POST `/workspace/join`

**Description**: Add current user to an existing workspace as a member

**Method**: `POST`

**Authentication**: Required (session-based)

**Request Body**:

```json
{
  "name": "string"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "createdBy": "string",
    "createdAt": "timestamp",
    "members": ["userId1", "userId2"]
  }
}
```

**Response** (Errors):

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: User or workspace not found
- **400 Bad Request**: Invalid workspace name
- **409 Conflict**: User already member of workspace
- **500 Internal Server Error**: Cannot join workspace or database error

---

### POST `/workspace/new`

**Description**: Create a new workspace and add current user as owner

**Method**: `POST`

**Authentication**: Required (session-based)

**Request Body**:

```json
{
  "name": "string"
}
```

**Response** (Success - 200):

```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "createdBy": "string",
    "createdAt": "timestamp",
    "members": ["userId"]
  }
}
```

**Response** (Errors):

- **401 Unauthorized**: User not authenticated
- **404 Not Found**: User not found in database
- **409 Conflict**: Workspace with same name already exists
- **400 Bad Request**: Invalid workspace name
- **500 Internal Server Error**: Cannot create workspace or database error

---

## Error Handling

All endpoints follow a consistent error response pattern:

**Standard Error Response**:

```json
{
  "success": false,
  "error": "descriptive error message"
}
```

**HTTP Status Codes**:

- **200 OK**: Successful request
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Authentication required but not provided
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists or conflict in operation
- **500 Internal Server Error**: Server-side error

---

## Authentication

Most endpoints require user authentication via session-based authentication using `better-auth`.

**Required Headers**:

- Session cookies (automatically managed by the browser)

**Session Verification**:

- Server verifies session using `auth.api.getSession()` from better-auth
- Checks if user exists in the database

---

## Database Integration

All endpoints interact with Drizzle ORM and the following main tables:

- `usersTable`: User authentication data
- `workspacesTable`: Workspace information
- `membersTable`: User-workspace relationships
- `workspaceMeetingTable`: Meeting data
- `meetingParticipantsTable`: Meeting participant tracking

---

## Rate Limiting

Currently no explicit rate limiting implemented at the API level.

---

## Pagination

Only the `/meeting/{slug}` endpoint supports pagination via the `page` query parameter.

---

## Versioning

No API versioning implemented. All endpoints are at `/api/*`
