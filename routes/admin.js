const express = require('express');
const router = express.Router();
const { adminMiddleware } = require('../middleware/adminMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser,
  getAllContacts,
  getContactDetails,
  updateContactStatus,
  deleteContact,
  grantAdminAccess,
  revokeAdminAccess,
  getAdminAnalytics,
  getSystemStatus
} = require('../cantroller/admin');

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:userId',   getUserDetails);
router.put('/users/:userId/status',   updateUserStatus);
router.delete('/users/:userId',   deleteUser);
router.post('/users/:userId/grant-admin',   grantAdminAccess);
router.post('/users/:userId/revoke-admin',   revokeAdminAccess);

// Contacts
router.get('/contacts',   getAllContacts);
router.get('/contacts/:contactId',   getContactDetails);
router.put('/contacts/:contactId/status',   updateContactStatus);
router.delete('/contacts/:contactId',   deleteContact);

// Analytics
router.get('/analytics',   getAdminAnalytics);
router.get('/system-status',   getSystemStatus);

module.exports = router;
