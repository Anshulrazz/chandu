# Admin API - Postman Collection Format

## Base URL
```
http://192.168.1.40:5500/api/admin
```

## Headers (All Requests)
```
Cookie: token=YOUR_JWT_TOKEN
Content-Type: application/json
```

---

## 📊 Dashboard

### GET Dashboard
```
Method: GET
URL: {{base_url}}/dashboard
Headers: 
  - Cookie: token={{token}}

Response: 200 OK
{
  "success": true,
  "data": {
    "totalUsers": number,
    "totalAdmins": number,
    "totalContacts": number,
    "contactsByStatus": array,
    "recentContacts": array,
    "recentUsers": array
  }
}
```

---

## 👥 Users

### LIST Users
```
Method: GET
URL: {{base_url}}/users?page=1&limit=10&search={{search_term}}
Headers:
  - Cookie: token={{token}}

Params:
  - page: 1 (number)
  - limit: 10 (number)
  - search: "" (string)

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": number,
    "pages": number,
    "currentPage": number,
    "limit": number
  }
}
```

### GET User Details
```
Method: GET
URL: {{base_url}}/users/:userId
Headers:
  - Cookie: token={{token}}

Params:
  - userId: "65a8e1b2c3d4e5f6g7h8i9j0" (string)

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {...},
    "contacts": [...],
    "totalContacts": number
  }
}
```

### UPDATE User Status
```
Method: PUT
URL: {{base_url}}/users/:userId/status
Headers:
  - Cookie: token={{token}}
  - Content-Type: application/json

Body (raw JSON):
{
  "isActive": true
}

Response: 200 OK
{
  "success": true,
  "data": {...}
}
```

### DELETE User
```
Method: DELETE
URL: {{base_url}}/users/:userId
Headers:
  - Cookie: token={{token}}

Response: 200 OK
{
  "success": true,
  "message": "User and associated data deleted successfully"
}
```

### GRANT Admin
```
Method: POST
URL: {{base_url}}/users/:userId/grant-admin
Headers:
  - Cookie: token={{token}}

Body: (empty)

Response: 200 OK
{
  "success": true,
  "data": {...}
}
```

### REVOKE Admin
```
Method: POST
URL: {{base_url}}/users/:userId/revoke-admin
Headers:
  - Cookie: token={{token}}

Body: (empty)

Response: 200 OK
{
  "success": true,
  "data": {...}
}
```

---

## 📧 Contacts

### LIST Contacts
```
Method: GET
URL: {{base_url}}/contacts?page=1&limit=10&search={{search}}&status={{status}}
Headers:
  - Cookie: token={{token}}

Params:
  - page: 1 (number)
  - limit: 10 (number)
  - search: "" (string)
  - status: "" (pending|resolved|closed)

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### GET Contact Details
```
Method: GET
URL: {{base_url}}/contacts/:contactId
Headers:
  - Cookie: token={{token}}

Params:
  - contactId: "65a8f2b4c3e1f9a2b1c2d3e4" (string)

Response: 200 OK
{
  "success": true,
  "data": {...}
}
```

### UPDATE Contact Status
```
Method: PUT
URL: {{base_url}}/contacts/:contactId/status
Headers:
  - Cookie: token={{token}}
  - Content-Type: application/json

Body (raw JSON):
{
  "status": "resolved"
}

Valid values: pending | resolved | closed

Response: 200 OK
{
  "success": true,
  "data": {...}
}
```

### DELETE Contact
```
Method: DELETE
URL: {{base_url}}/contacts/:contactId
Headers:
  - Cookie: token={{token}}

Response: 200 OK
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

---

## 📊 Analytics

### GET Analytics
```
Method: GET
URL: {{base_url}}/analytics
Headers:
  - Cookie: token={{token}}

Response: 200 OK
{
  "success": true,
  "data": {
    "usersPerMonth": [
      {
        "_id": { "month": 1, "year": 2026 },
        "count": number
      }
    ],
    "contactsPerMonth": [...],
    "contactCategories": [...]
  }
}
```

---

## ⚙️ System

### GET System Status
```
Method: GET
URL: {{base_url}}/system-status
Headers:
  - Cookie: token={{token}}

Response: 200 OK
{
  "success": true,
  "data": {
    "uptime": number,
    "memory": {
      "heapUsed": "45 MB",
      "heapTotal": "120 MB"
    },
    "timestamp": "ISO-8601"
  }
}
```

---

## 🔑 Authentication Errors

### 401 - Not Logged In
```
{
  "success": false,
  "message": "Please login first"
}
```

### 401 - Invalid Token
```
{
  "success": false,
  "message": "Invalid or expired token. Please login again."
}
```

### 403 - Not Admin
```
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Admin Dashboard Overview
```
1. GET /admin/dashboard
2. Check: totalUsers, totalContacts, recentUsers
3. Verify: All statistics are numbers
```

### Scenario 2: User Management
```
1. GET /admin/users?page=1&limit=5
2. SELECT a userId from response
3. GET /admin/users/:userId
4. Verify: User details and contacts array
5. PUT /admin/users/:userId/status with {"isActive": false}
6. Verify: User status updated
```

### Scenario 3: Contact Management
```
1. GET /admin/contacts?status=pending
2. SELECT a contactId
3. GET /admin/contacts/:contactId
4. PUT /admin/contacts/:contactId/status with {"status": "resolved"}
5. Verify: Status changed
```

### Scenario 4: Admin Privileges
```
1. GET /admin/users?limit=5
2. SELECT a userId with isAdmin: false
3. POST /admin/users/:userId/grant-admin
4. Verify: isAdmin is now true
5. POST /admin/users/:userId/revoke-admin
6. Verify: isAdmin is now false
```

### Scenario 5: Analytics
```
1. GET /admin/analytics
2. Check: usersPerMonth array
3. Check: contactsPerMonth array
4. Check: contactCategories array
5. Verify: All have expected structure
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot populate path `userId`"
**Solution**: Ensure Contact model has userId field as ObjectId ref

### Issue: 401 Unauthorized
**Solution**: 
1. Check JWT token is in cookies
2. Verify token is not expired
3. Re-login if needed

### Issue: 403 Access Denied
**Solution**:
1. Verify user has isAdmin: true
2. Check user account in database

### Issue: 404 Not Found
**Solution**:
1. Verify correct ID format (24-character hex string)
2. Ensure record exists in database
3. Check spelling of endpoint

---

## 📱 cURL Examples

### Dashboard
```bash
curl -X GET http://192.168.1.40:5500/api/admin/dashboard \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

### List Users
```bash
curl -X GET 'http://192.168.1.40:5500/api/admin/users?page=1&limit=10' \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

### Update Contact Status
```bash
curl -X PUT http://192.168.1.40:5500/api/admin/contacts/CONTACT_ID/status \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"resolved"}'
```

### Delete User
```bash
curl -X DELETE http://192.168.1.40:5500/api/admin/users/USER_ID \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

### Get Analytics
```bash
curl -X GET http://192.168.1.40:5500/api/admin/analytics \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

---

## 📊 Response Data Types

### User Object
```json
{
  "_id": "string (MongoDB ObjectId)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "isAdmin": "boolean",
  "isActive": "boolean",
  "createdAt": "ISO-8601 timestamp"
}
```

### Contact Object
```json
{
  "_id": "string (MongoDB ObjectId)",
  "userId": "string (ObjectId) or object",
  "name": "string",
  "email": "string",
  "phone": "string",
  "category": "string",
  "message": "string",
  "status": "string (pending|resolved|closed)",
  "createdAt": "ISO-8601 timestamp"
}
```

### Pagination Object
```json
{
  "total": "number",
  "pages": "number",
  "currentPage": "number",
  "limit": "number"
}
```

---

## ✅ Request Checklist

Before making requests, verify:
- [ ] Base URL is correct
- [ ] JWT token is valid and not expired
- [ ] User has admin privileges
- [ ] Correct HTTP method is used
- [ ] URL parameters are correct
- [ ] Request body is valid JSON (if applicable)
- [ ] Headers include Content-Type if needed
- [ ] Cookie with token is included

---

Version: 1.0
Created: January 16, 2026
