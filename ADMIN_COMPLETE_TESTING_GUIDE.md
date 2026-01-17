# Admin API - Complete Testing Guide with Real Examples

## 📋 Table of Contents
1. Authentication Setup
2. All 13 Endpoints with Examples
3. Step-by-Step Testing Guide
4. Error Handling

---

## 🔑 Authentication Setup

### Step 1: Login
```bash
curl -X POST http://192.168.1.40:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
    "name": "Admin User",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

The token will be set in cookies automatically. Use this for all subsequent requests.

---

## 🎯 13 Endpoints - Complete Examples

### ENDPOINT 1: GET Dashboard Statistics

**Purpose:** Get overview of system with stats and recent data

**Request:**
```bash
curl -X GET http://192.168.1.40:5500/api/admin/dashboard \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Full Response Example:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "totalAdmins": 3,
    "totalContacts": 150,
    "contactsByStatus": [
      { "_id": "pending", "count": 45 },
      { "_id": "resolved", "count": 100 },
      { "_id": "closed", "count": 5 }
    ],
    "recentContacts": [
      {
        "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
        "name": "John Support",
        "email": "john@example.com",
        "message": "Need help",
        "status": "pending",
        "userId": {
          "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdAt": "2026-01-16T10:00:00.000Z"
      }
    ],
    "recentUsers": [
      {
        "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "isAdmin": false,
        "isActive": true,
        "createdAt": "2026-01-15T10:00:00.000Z"
      }
    ]
  },
  "message": "Dashboard stats fetched successfully"
}
```

**JavaScript Test:**
```javascript
async function testDashboard() {
  const response = await fetch('http://192.168.1.40:5500/api/admin/dashboard', {
    credentials: 'include'
  });
  const data = await response.json();
  console.log('Dashboard:', data);
  console.log('Total Users:', data.data.totalUsers);
  console.log('Pending Contacts:', data.data.contactsByStatus.find(s => s._id === 'pending')?.count);
}
testDashboard();
```

---

### ENDPOINT 2: GET All Users (Paginated)

**Purpose:** List all users with pagination and search

**Request (Basic):**
```bash
curl -X GET 'http://192.168.1.40:5500/api/admin/users?page=1&limit=10' \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Request (With Search):**
```bash
curl -X GET 'http://192.168.1.40:5500/api/admin/users?page=1&limit=5&search=john' \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
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
    "pages": 5,
    "currentPage": 1,
    "limit": 5
  },
  "message": "Users fetched successfully"
}
```

**JavaScript Test:**
```javascript
async function listUsers(page = 1, search = '') {
  const params = new URLSearchParams({
    page,
    limit: 10,
    search
  });
  
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/users?${params}`,
    { credentials: 'include' }
  );
  const data = await response.json();
  
  console.log('Users:', data.data);
  console.log('Total:', data.pagination.total);
  console.log('Pages:', data.pagination.pages);
  
  return data;
}

listUsers(1, 'john');
```

---

### ENDPOINT 3: GET User Details

**Purpose:** Get specific user with all their contacts

**Request:**
```bash
curl -X GET http://192.168.1.40:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0 \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
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
        "name": "Support Request 1",
        "email": "support1@example.com",
        "message": "Need help with account",
        "status": "pending",
        "createdAt": "2026-01-16T10:00:00.000Z"
      },
      {
        "_id": "65a8f2b4c3e1f9a2b1c2d3e5",
        "name": "Support Request 2",
        "email": "support2@example.com",
        "message": "Billing issue",
        "status": "resolved",
        "createdAt": "2026-01-15T10:00:00.000Z"
      }
    ],
    "totalContacts": 2
  },
  "message": "User details fetched successfully"
}
```

**Response Error (Status 404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**JavaScript Test:**
```javascript
async function getUserDetails(userId) {
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/users/${userId}`,
    { credentials: 'include' }
  );
  const data = await response.json();
  
  if (data.success) {
    console.log('User:', data.data.user);
    console.log('Total Contacts:', data.data.totalContacts);
    console.log('Contacts:', data.data.contacts);
  } else {
    console.error('Error:', data.message);
  }
  
  return data;
}

getUserDetails('65a8e1b2c3d4e5f6g7h8i9j0');
```

---

### ENDPOINT 4: PUT Update User Status

**Purpose:** Activate or deactivate a user

**Request:**
```bash
curl -X PUT http://192.168.1.40:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0/status \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

**Request Body:**
```json
{
  "isActive": false
}
```

**Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8e1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "isAdmin": false,
    "isActive": false,
    "createdAt": "2026-01-15T10:00:00.000Z"
  },
  "message": "User status updated successfully"
}
```

**JavaScript Test:**
```javascript
async function updateUserStatus(userId, isActive) {
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/users/${userId}/status`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive })
    }
  );
  const data = await response.json();
  console.log('Updated User:', data.data);
  return data;
}

updateUserStatus('65a8e1b2c3d4e5f6g7h8i9j0', false);
```

---

### ENDPOINT 5: DELETE User

**Purpose:** Delete a user and all associated data

**Request:**
```bash
curl -X DELETE http://192.168.1.40:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0 \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
```json
{
  "success": true,
  "message": "User and associated data deleted successfully"
}
```

**Response Error (Status 404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

**JavaScript Test:**
```javascript
async function deleteUser(userId) {
  const confirmed = confirm('Are you sure you want to delete this user?');
  if (!confirmed) return;
  
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/users/${userId}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );
  const data = await response.json();
  
  if (data.success) {
    console.log('User deleted successfully');
  } else {
    console.error('Error:', data.message);
  }
  
  return data;
}

deleteUser('65a8e1b2c3d4e5f6g7h8i9j0');
```

---

### ENDPOINT 6: POST Grant Admin Access

**Purpose:** Give admin privileges to a user

**Request:**
```bash
curl -X POST http://192.168.1.40:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0/grant-admin \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
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

**Error Response (Status 400):**
```json
{
  "success": false,
  "message": "Cannot modify your own admin status"
}
```

**JavaScript Test:**
```javascript
async function grantAdminAccess(userId) {
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/users/${userId}/grant-admin`,
    {
      method: 'POST',
      credentials: 'include'
    }
  );
  const data = await response.json();
  
  if (data.success) {
    console.log('Admin access granted to:', data.data.name);
  } else {
    console.error('Error:', data.message);
  }
  
  return data;
}

grantAdminAccess('65a8e1b2c3d4e5f6g7h8i9j0');
```

---

### ENDPOINT 7: POST Revoke Admin Access

**Purpose:** Remove admin privileges from a user

**Request:**
```bash
curl -X POST http://192.168.1.40:5500/api/admin/users/65a8e1b2c3d4e5f6g7h8i9j0/revoke-admin \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
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

**JavaScript Test:**
```javascript
async function revokeAdminAccess(userId) {
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/users/${userId}/revoke-admin`,
    {
      method: 'POST',
      credentials: 'include'
    }
  );
  const data = await response.json();
  console.log('Admin access revoked:', data.data);
  return data;
}

revokeAdminAccess('65a8e1b2c3d4e5f6g7h8i9j0');
```

---

### ENDPOINT 8: GET All Contacts (Paginated & Filterable)

**Purpose:** List all contacts with pagination, search, and status filtering

**Request (All Parameters):**
```bash
curl -X GET 'http://192.168.1.40:5500/api/admin/contacts?page=1&limit=10&search=john&status=pending' \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
      "name": "John Support",
      "email": "john@example.com",
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

**JavaScript Test:**
```javascript
async function listContacts(page = 1, search = '', status = '') {
  const params = new URLSearchParams({
    page,
    limit: 10,
    search,
    status
  });
  
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/contacts?${params}`,
    { credentials: 'include' }
  );
  const data = await response.json();
  
  console.log('Contacts:', data.data);
  console.log('Total:', data.pagination.total);
  
  return data;
}

// Test different filters
listContacts(1, '', 'pending');      // All pending
listContacts(1, 'john', '');          // Search "john"
listContacts(1, 'john', 'resolved');  // Search "john" AND resolved
```

---

### ENDPOINT 9: GET Contact Details

**Purpose:** Get specific contact information

**Request:**
```bash
curl -X GET http://192.168.1.40:5500/api/admin/contacts/65a8f2b4c3e1f9a2b1c2d3e4 \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
    "name": "John Support",
    "email": "john@example.com",
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

**JavaScript Test:**
```javascript
async function getContactDetails(contactId) {
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/contacts/${contactId}`,
    { credentials: 'include' }
  );
  const data = await response.json();
  
  if (data.success) {
    console.log('Contact:', data.data);
    console.log('From User:', data.data.userId.name);
  }
  
  return data;
}

getContactDetails('65a8f2b4c3e1f9a2b1c2d3e4');
```

---

### ENDPOINT 10: PUT Update Contact Status

**Purpose:** Change contact status (pending → resolved → closed)

**Request:**
```bash
curl -X PUT http://192.168.1.40:5500/api/admin/contacts/65a8f2b4c3e1f9a2b1c2d3e4/status \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved"
  }'
```

**Request Body:**
```json
{
  "status": "resolved"
}
```

**Valid Status Values:**
- `pending` - New/incoming
- `resolved` - Issue resolved
- `closed` - Ticket closed

**Response (Status 200):**
```json
{
  "success": true,
  "data": {
    "_id": "65a8f2b4c3e1f9a2b1c2d3e4",
    "name": "John Support",
    "email": "john@example.com",
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

**Error Response (Status 400):**
```json
{
  "success": false,
  "message": "Invalid status. Use: pending, resolved, or closed"
}
```

**JavaScript Test:**
```javascript
async function updateContactStatus(contactId, newStatus) {
  const validStatuses = ['pending', 'resolved', 'closed'];
  
  if (!validStatuses.includes(newStatus)) {
    console.error('Invalid status:', newStatus);
    return;
  }
  
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/contacts/${contactId}/status`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }
  );
  const data = await response.json();
  
  if (data.success) {
    console.log('Status updated to:', data.data.status);
  }
  
  return data;
}

updateContactStatus('65a8f2b4c3e1f9a2b1c2d3e4', 'resolved');
```

---

### ENDPOINT 11: DELETE Contact

**Purpose:** Delete a contact record

**Request:**
```bash
curl -X DELETE http://192.168.1.40:5500/api/admin/contacts/65a8f2b4c3e1f9a2b1c2d3e4 \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**JavaScript Test:**
```javascript
async function deleteContact(contactId) {
  const confirmed = confirm('Delete this contact?');
  if (!confirmed) return;
  
  const response = await fetch(
    `http://192.168.1.40:5500/api/admin/contacts/${contactId}`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );
  const data = await response.json();
  console.log(data.message);
  return data;
}

deleteContact('65a8f2b4c3e1f9a2b1c2d3e4');
```

---

### ENDPOINT 12: GET Analytics

**Purpose:** Get monthly trends and category distribution

**Request:**
```bash
curl -X GET http://192.168.1.40:5500/api/admin/analytics \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
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

**JavaScript Test:**
```javascript
async function getAnalytics() {
  const response = await fetch(
    'http://192.168.1.40:5500/api/admin/analytics',
    { credentials: 'include' }
  );
  const data = await response.json();
  
  console.log('Users Per Month:', data.data.usersPerMonth);
  console.log('Contacts Per Month:', data.data.contactsPerMonth);
  console.log('Categories:', data.data.contactCategories);
  
  // Get latest month data
  const latestUserMonth = data.data.usersPerMonth[data.data.usersPerMonth.length - 1];
  console.log(`Latest Month: ${latestUserMonth._id.month}/${latestUserMonth._id.year}, Users: ${latestUserMonth.count}`);
  
  return data;
}

getAnalytics();
```

---

### ENDPOINT 13: GET System Status

**Purpose:** Monitor server health and performance

**Request:**
```bash
curl -X GET http://192.168.1.40:5500/api/admin/system-status \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Response (Status 200):**
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

**Data Explanation:**
- `uptime`: Server uptime in seconds (3600 = 1 hour)
- `heapUsed`: Memory currently in use
- `heapTotal`: Total available memory
- `timestamp`: Current server time

**JavaScript Test:**
```javascript
async function getSystemStatus() {
  const response = await fetch(
    'http://192.168.1.40:5500/api/admin/system-status',
    { credentials: 'include' }
  );
  const data = await response.json();
  
  const hours = Math.floor(data.data.uptime / 3600);
  const minutes = Math.floor((data.data.uptime % 3600) / 60);
  
  console.log(`Server Uptime: ${hours}h ${minutes}m`);
  console.log(`Memory Usage: ${data.data.memory.heapUsed} / ${data.data.memory.heapTotal}`);
  console.log(`Server Time: ${new Date(data.data.timestamp).toLocaleString()}`);
  
  return data;
}

// Get status every 30 seconds
setInterval(getSystemStatus, 30000);
```

---

## 🧪 Complete Testing Workflow

### Test 1: Full Admin Workflow
```javascript
async function completeWorkflow() {
  // 1. Get Dashboard
  console.log('1. Getting Dashboard...');
  const dashboard = await fetch('http://192.168.1.40:5500/api/admin/dashboard', 
    { credentials: 'include' }).then(r => r.json());
  console.log('Users:', dashboard.data.totalUsers);
  
  // 2. List Users
  console.log('2. Listing Users...');
  const users = await fetch('http://192.168.1.40:5500/api/admin/users?page=1&limit=5',
    { credentials: 'include' }).then(r => r.json());
  const userId = users.data[0]._id;
  console.log('First User:', userId);
  
  // 3. Get User Details
  console.log('3. Getting User Details...');
  const userDetails = await fetch(`http://192.168.1.40:5500/api/admin/users/${userId}`,
    { credentials: 'include' }).then(r => r.json());
  console.log('User Contacts:', userDetails.data.totalContacts);
  
  // 4. List Contacts
  console.log('4. Listing Contacts...');
  const contacts = await fetch('http://192.168.1.40:5500/api/admin/contacts?page=1&limit=5',
    { credentials: 'include' }).then(r => r.json());
  console.log('Total Contacts:', contacts.pagination.total);
  
  // 5. Get Analytics
  console.log('5. Getting Analytics...');
  const analytics = await fetch('http://192.168.1.40:5500/api/admin/analytics',
    { credentials: 'include' }).then(r => r.json());
  console.log('Categories:', analytics.data.contactCategories);
  
  // 6. Get System Status
  console.log('6. Getting System Status...');
  const status = await fetch('http://192.168.1.40:5500/api/admin/system-status',
    { credentials: 'include' }).then(r => r.json());
  console.log('Memory:', status.data.memory);
}

completeWorkflow();
```

---

## ✅ Verification Checklist

- [ ] All 13 endpoints tested
- [ ] Request/response formats verified
- [ ] Error cases handled
- [ ] Pagination working
- [ ] Search functioning
- [ ] Filters applied correctly
- [ ] Status codes correct
- [ ] Data types validated
- [ ] Authentication verified
- [ ] Admin privileges checked

---

Version: 1.0
Created: January 16, 2026
