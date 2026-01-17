const express = require('express');
const router = express.Router();
const { createContact, getAllContacts } = require('../cantroller/contact');

// Route to create a new contact message
router.post('/contact', createContact);
router.get('/contacts', getAllContacts);

module.exports = router;