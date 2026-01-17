const Contact = require('../models/Contacts');

// Create a new contact message
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const contact = await Contact.create({ name, email, phone, message });
        res.status(201).json({ success: true, contact });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
 
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ success: true, contacts });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};