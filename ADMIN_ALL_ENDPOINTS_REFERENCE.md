# Admin API Endpoints - Complete Reference with Request/Response

## Base URL
```
http://localhost:5500/api/admin
```

## Authentication
All endpoints require:
- Valid JWT token in cookies
- Admin privileges (isAdmin: true)

---

## 📊 Dashboard Endpoints

### 1. GET Dashboard Statistics
**Endpoint:** `GET /api/admin/dashboard`

**Description:** Get overall dashboard statistics

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "totalAdmins": 3,
    "totalContacts": 150,
    "contactsByStatus": [
      {
        "_id": "pending",
        "count": 45
      },
      {
        "_id": "resolved",
        "count": 100
      },
      {
        "_id": "closed",
        "count": 5
      }
    ],
    "recentContacts": [
      {
        "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Need help with...",
        "status": "pending",
        "userId": {
          "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
          "name": "User Name",
          "email": "user@example.com"
        },
        "createdAt": "2026-01-16T10:00:00.000Z"
      }
    ],
    "recentUsers": [
      {
        "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "9876543210",
        "isAdmin": false,
        "isActive": true,
        "createdAt": "2026-01-16T09:00:00.000Z"
      }
    ]
  },
  "message": "Dashboard stats fetched successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Please login first"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## 👥 User Management Endpoints

### 2. GET All Users
**Endpoint:** `GET /api/admin/users`

**Description:** Get paginated list of all users with optional search

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Query Parameters:**
```
page=1&limit=10&search=john
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Records per page |
| search | string | No | "" | Search by user name (case-insensitive) |

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "isAdmin": false,
      "isActive": true,
      "createdAt": "2026-01-15T10:00:00.000Z"
    },
    {
      "_id": "65a8e1b2c3d4e5f6g7h8i9j1",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "9876543211",
      "isAdmin": true,
      "isActive": true,
      "createdAt": "2026-01-14T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "currentPage": 1,
    "limit": 10
  },
  "message": "Users fetched successfully"
}
```

**Example Request:**
```bash
curl -X GET 'http://localhost:5500/api/admin/users?page=1&limit=10&search=john' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

**JavaScript Example:**
```javascript
fetch('http://localhost:5500/api/admin/users?page=1&limit=10&search=john', {
  method: 'GET',
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 3. GET User Details
**Endpoint:** `GET /api/admin/users/:userId`

**Description:** Get detailed information about a specific user including all their contacts

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**URL Parameters:**
```
userId (required) - MongoDB user ID
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "isAdmin": false,
      "isActive": true,
      "createdAt": "2026-01-15T10:00:00.000Z"
    },
    "contacts": [
      {
        "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
        "name": "Support Request",
        "email": "support@example.com",
        "message": "I need help with my account",
        "status": "pending",
        "createdAt": "2026-01-16T10:00:00.000Z"
      }
    ],
    "totalContacts": 5
  },
  "message": "User details fetched successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Example Request:**
```bash
curl -X GET 'http://localhost:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

### 4. PUT Update User Status
**Endpoint:** `PUT /api/admin/users/:userId/status`

**Description:** Update user active status (activate/deactivate user)

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
Content-Type: application/json
```

**URL Parameters:**
```
userId (required) - MongoDB user ID
```

**Request Body:**
```json
{
  "isActive": true
}
```

| Field | Type | Required | Values | Description |
|-------|------|----------|--------|-------------|
| isActive | boolean | Yes | true/false | Set user as active or inactive |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "isAdmin": false,
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00.000Z"
  },
  "message": "User status updated successfully"
}
```

**Example Request:**
```bash
curl -X PUT 'http://localhost:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0/status' \
  -H 'Cookie: token=YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "isActive": false
  }'
```

**JavaScript Example:**
```javascript
fetch('http://localhost:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0/status', {
  method: 'PUT',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ isActive: false })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 5. DELETE User
**Endpoint:** `DELETE /api/admin/users/:userId`

**Description:** Delete a user and all associated contacts

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**URL Parameters:**
```
userId (required) - MongoDB user ID
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User and associated data deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Example Request:**
```bash
curl -X DELETE 'http://localhost:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

### 6. POST Grant Admin Access
**Endpoint:** `POST /api/admin/users/:userId/grant-admin`

**Description:** Grant admin privileges to a user

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**URL Parameters:**
```
userId (required) - MongoDB user ID
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "isAdmin": true,
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00.000Z"
  },
  "message": "Admin access granted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot modify your own admin status"
}
```

**Example Request:**
```bash
curl -X POST 'http://localhost:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0/grant-admin' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

### 7. POST Revoke Admin Access
**Endpoint:** `POST /api/admin/users/:userId/revoke-admin`

**Description:** Remove admin privileges from a user

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**URL Parameters:**
```
userId (required) - MongoDB user ID
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "isAdmin": false,
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00.000Z"
  },
  "message": "Admin access revoked successfully"
}
```

**Example Request:**
```bash
curl -X POST 'http://localhost:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0/revoke-admin' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

## 📧 Contact Management Endpoints

### 8. GET All Contacts
**Endpoint:** `GET /api/admin/contacts`

**Description:** Get paginated list of all contacts with search and filtering

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Query Parameters:**
```
page=1&limit=10&search=john&status=pending
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Records per page |
| search | string | No | "" | Search by contact name or email |
| status | string | No | "" | Filter by status (pending, resolved, closed) |

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
      "name": "John Support",
      "email": "john.support@example.com",
      "phone": "9876543210",
      "category": "support",
      "message": "I need help with my account setup",
      "status": "pending",
      "userId": {
        "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "createdAt": "2026-01-16T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "pages": 15,
    "currentPage": 1,
    "limit": 10
  },
  "message": "Contacts fetched successfully"
}
```

**Example Request:**
```bash
curl -X GET 'http://localhost:5500/api/admin/contacts?page=1&limit=10&search=john&status=pending' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

### 9. GET Contact Details
**Endpoint:** `GET /api/admin/contacts/:contactId`

**Description:** Get detailed information about a specific contact

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**URL Parameters:**
```
contactId (required) - MongoDB contact ID
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
    "name": "John Support",
    "email": "john.support@example.com",
    "phone": "9876543210",
    "category": "support",
    "message": "I need help with my account setup. I'm unable to verify my email.",
    "status": "pending",
    "userId": {
      "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "createdAt": "2026-01-16T10:00:00.000Z"
  },
  "message": "Contact details fetched successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Contact not found"
}
```

**Example Request:**
```bash
curl -X GET 'http://localhost:5500/api/admin/contacts/65a8f2b4c3e1f9a2b1c2d3e4' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

### 10. PUT Update Contact Status
**Endpoint:** `PUT /api/admin/contacts/:contactId/status`

**Description:** Update contact status

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
Content-Type: application/json
```

**URL Parameters:**
```
contactId (required) - MongoDB contact ID
```

**Request Body:**
```json
{
  "status": "resolved"
}
```

| Field | Type | Required | Values | Description |
|-------|------|----------|--------|-------------|
| status | string | Yes | pending, resolved, closed | New status for the contact |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
    "name": "John Support",
    "email": "john.support@example.com",
    "phone": "9876543210",
    "category": "support",
    "message": "I need help with my account setup",
    "status": "resolved",
    "userId": {
      "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "createdAt": "2026-01-16T10:00:00.000Z"
  },
  "message": "Contact status updated successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid status. Use: pending, resolved, or closed"
}
```

**Example Request:**
```bash
curl -X PUT 'http://localhost:5500/api/admin/contacts/65a8f2b4c3e1f9a2b1c2d3e4/status' \
  -H 'Cookie: token=YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "resolved"
  }'
```

**JavaScript Example:**
```javascript
fetch('http://localhost:5500/api/admin/contacts/65a8f2b4c3e1f9a2b1c2d3e4/status', {
  method: 'PUT',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'resolved' })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 11. DELETE Contact
**Endpoint:** `DELETE /api/admin/contacts/:contactId`

**Description:** Delete a contact record

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**URL Parameters:**
```
contactId (required) - MongoDB contact ID
```

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Contact not found"
}
```

**Example Request:**
```bash
curl -X DELETE 'http://localhost:5500/api/admin/contacts/65a8f2b4c3e1f9a2b1c2d3e4' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

## 📊 Analytics Endpoints

### 12. GET Admin Analytics
**Endpoint:** `GET /api/admin/analytics`

**Description:** Get analytics data including user trends, contact trends, and category distribution

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "usersPerMonth": [
      {
        "_id": {
          "month": 1,
          "year": 2026
        },
        "count": 10
      },
      {
        "_id": {
          "month": 2,
          "year": 2026
        },
        "count": 15
      }
    ],
    "contactsPerMonth": [
      {
        "_id": {
          "month": 1,
          "year": 2026
        },
        "count": 45
      },
      {
        "_id": {
          "month": 2,
          "year": 2026
        },
        "count": 60
      }
    ],
    "contactCategories": [
      {
        "_id": "support",
        "count": 80
      },
      {
        "_id": "feedback",
        "count": 40
      },
      {
        "_id": "complaint",
        "count": 30
      }
    ]
  },
  "message": "Analytics fetched successfully"
}
```

**Example Request:**
```bash
curl -X GET 'http://localhost:5500/api/admin/analytics' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

**JavaScript Example:**
```javascript
fetch('http://localhost:5500/api/admin/analytics', {
  method: 'GET',
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## ⚙️ System Endpoints

### 13. GET System Status
**Endpoint:** `GET /api/admin/system-status`

**Description:** Get current server status and system information

**Headers:**
```
Cookie: token=YOUR_JWT_TOKEN
```

**Query Parameters:** None

**Request Body:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "uptime": 3600,
    "memory": {
      "heapUsed": "45 MB",
      "heapTotal": "120 MB"
    },
    "timestamp": "2026-01-16T10:30:45.123Z"
  },
  "message": "System status fetched successfully"
}
```

| Field | Description |
|-------|-------------|
| uptime | Server uptime in seconds |
| memory.heapUsed | Memory currently in use (MB) |
| memory.heapTotal | Total memory available (MB) |
| timestamp | Current server timestamp |

**Example Request:**
```bash
curl -X GET 'http://localhost:5500/api/admin/system-status' \
  -H 'Cookie: token=YOUR_JWT_TOKEN'
```

---

## 🔴 Common Error Responses

### 401 Unauthorized - Not Logged In
```json
{
  "success": false,
  "message": "Please login first"
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token. Please login again."
}
```

### 403 Forbidden - Not Admin
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User/Contact not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid status. Use: pending, resolved, or closed"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📝 Status Codes Reference

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters or data |
| 401 | Unauthorized | Not authenticated or token expired |
| 403 | Forbidden | Not authorized (not admin) |
| 404 | Not Found | Resource does not exist |
| 500 | Server Error | Internal server error |

---

## 🧪 Complete Integration Example

```javascript
// Configuration
const API_URL = 'http://localhost:5500/api';

// Function to fetch dashboard
async function getDashboard() {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    if (data.success) {
      console.log('Dashboard:', data.data);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Function to update contact status
async function updateContactStatus(contactId, newStatus) {
  try {
    const response = await fetch(`${API_URL}/admin/contacts/${contactId}/status`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Contact updated:', data.data);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Function to grant admin access
async function grantAdminAccess(userId) {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/grant-admin`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    if (data.success) {
      console.log('Admin access granted:', data.data);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Usage
getDashboard();
updateContactStatus('65a8f2b4c3e1f9a2b1c2d3e4', 'resolved');
grantAdminAccess('65a8e1b2c3d4e5f6g7h8i9j0');
```

---

## 📋 Quick Endpoint Summary

| # | Method | Endpoint | Purpose |
|----|--------|----------|---------|
| 1 | GET | `/admin/dashboard` | Dashboard statistics |
| 2 | GET | `/admin/users` | List users |
| 3 | GET | `/admin/users/:userId` | User details |
| 4 | PUT | `/admin/users/:userId/status` | Update user status |
| 5 | DELETE | `/admin/users/:userId` | Delete user |
| 6 | POST | `/admin/users/:userId/grant-admin` | Grant admin |
| 7 | POST | `/admin/users/:userId/revoke-admin` | Revoke admin |
| 8 | GET | `/admin/contacts` | List contacts |
| 9 | GET | `/admin/contacts/:contactId` | Contact details |
| 10 | PUT | `/admin/contacts/:contactId/status` | Update status |
| 11 | DELETE | `/admin/contacts/:contactId` | Delete contact |
| 12 | GET | `/admin/analytics` | Analytics data |
| 13 | GET | `/admin/system-status` | System status |

---

## 🔑 Authentication Note

All endpoints require:
1. **JWT Token** - Must be present in cookies (token=YOUR_JWT_TOKEN)
2. **Admin Status** - User must have isAdmin: true
3. **Valid Token** - Token must not be expired

If either requirement is missing, you'll receive a 401 or 403 error.

---

Created: January 16, 2026
Last Updated: January 16, 2026
Version: 1.0
