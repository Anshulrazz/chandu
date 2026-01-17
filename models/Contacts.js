const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "1234567890" },
    category: { type: String, default: "general" },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'closed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Contact', ContactSchema);