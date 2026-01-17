const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { unlock } = require('../routes/auth');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "1234567890" },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    unlockeKey: {
        type: String,
        default: "",
    },
    unlockKeyExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
UserSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set token expire time (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

UserSchema.pre("find", function (next) {
    // This will run before any find query
    // But to modify, it's tricky. Perhaps better to call in controllers.
    next();
});

UserSchema.methods.checkAndDeleteExpiredUnlockKey = function () {
    if (this.unlockKeyExpire && Date.now() > this.unlockKeyExpire) {
        this.unlockeKey = "";
        this.unlockKeyExpire = undefined;
    }
};
module.exports = mongoose.model('User', UserSchema);