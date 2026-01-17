const User = require('../models/User');
const Contact = require('../models/Contacts');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalContacts = await Contact.countDocuments();
    
    const contactsByStatus = await Contact.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');

    res.status(200).json({
      success: true,
      data: { totalUsers, totalAdmins, totalContacts, contactsByStatus, recentContacts, recentUsers },
      message: "Dashboard stats fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error fetching dashboard stats" });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {}; 

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { total, pages: Math.ceil(total / limit), currentPage: Number(page), limit: Number(limit) },
      message: "Users fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error fetching users" });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userContacts = await Contact.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { user, contacts: userContacts, totalContacts: userContacts.length },
      message: "User details fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error fetching user details" });
  }
};

// Update User Status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user, message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error updating user status" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Contact.deleteMany({ userId });

    res.status(200).json({ success: true, message: "User and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error deleting user" });
  }
};

// Get All Contacts
exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .populate('userId', 'name email phone')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: { total, pages: Math.ceil(total / limit), currentPage: Number(page), limit: Number(limit) },
      message: "Contacts fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error fetching contacts" });
  }
};

// Get Contact Details
exports.getContactDetails = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId).populate('userId', 'name email phone');

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, data: contact, message: "Contact details fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error fetching contact details" });
  }
};

// Update Contact Status
exports.updateContactStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { status } = req.body;

    if (!['pending', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const contact = await Contact.findByIdAndUpdate(contactId, { status }, { new: true })
      .populate('userId', 'name email phone');

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, data: contact, message: "Contact status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error updating contact status" });
  }
};

// Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error deleting contact" });
  }
};

// Grant Admin Access
exports.grantAdminAccess = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ success: false, message: "Cannot modify your own admin status" });
    }

    const user = await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user, message: "Admin access granted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error granting admin access" });
  }
};

// Revoke Admin Access
exports.revokeAdminAccess = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ success: false, message: "Cannot modify your own admin status" });
    }

    const user = await User.findByIdAndUpdate(userId, { isAdmin: false }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user, message: "Admin access revoked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error revoking admin access" });
  }
};

// Get Admin Analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    const usersPerMonth = await User.aggregate([
      { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const contactsPerMonth = await Contact.aggregate([
      { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const contactCategories = await Contact.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: { usersPerMonth, contactsPerMonth, contactCategories },
      message: "Analytics fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error fetching analytics" });
  }
};

// Get System Status
exports.getSystemStatus = async (req, res) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      success: true,
      data: {
        uptime: Math.floor(uptime),
        memory: {
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
        },
        timestamp: new Date()
      },
      message: "System status fetched successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error fetching system status" });
  }
};
