const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Razorpay = require("razorpay");
require("dotenv").config();

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    user = await User.create({ name, email, password });
    const token = await user.generateToken();

    res.status(201).cookie("token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }).json({ success: true, user, token });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).json({ success: false, message: "No account found with this email. Please check your email or sign up." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password. Please try again or use 'Forgot Password' option." });

    const token = await user.generateToken();
    res.status(200).cookie("token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }).json({ success: true, user, token });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout User
exports.logout = async (req, res) => {
  try {
    res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Profile
exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.checkAndDeleteExpiredUnlockKey();
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate Reset Token
    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    // Reset Password URL
    const resetUrl = `http://localhost:3000/reset-password/${resetPasswordToken}`;

    // HTML Email Template
    const message = `
      <div style="max-width: 600px; margin: auto; font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); padding: 40px 20px; border-radius: 20px;">
        <div style="background: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e3c72; font-size: 28px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Samraat Trader</h1>
            <div style="height: 3px; width: 60px; background: linear-gradient(45deg, #1e3c72, #2a5298); margin: 15px auto;"></div>
          </div>
          
          <h2 style="color: #1e3c72; font-size: 24px; margin-bottom: 20px; text-align: center;">Password Reset Request</h2>
          
          <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 25px; text-align: center;">
            We received a request to reset your password. To ensure the security of your account, please click the button below to set a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 15px 35px; font-size: 16px; color: #fff; background: linear-gradient(45deg, #1e3c72, #2a5298); text-decoration: none; border-radius: 50px; font-weight: 600; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(30, 60, 114, 0.3); transition: all 0.3s;">
              Reset My Password
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px; text-align: center;">
              If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
            </p>
            
            <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 5px;">
              For security reasons, this link will expire in 10 minutes.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #1e3c72; margin: 0;">
              Best Regards,<br>
              <strong>Samraat Trader Team</strong>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: rgba(255, 255, 255, 0.8); font-size: 12px;">
          © ${new Date().getFullYear()} Samraat Trader. All rights reserved.
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Your Password - Samraat Trader",
        message,
      });

      res.status(200).json({
        success: true,
        message: `A password reset link has been sent to ${user.email}. Please check your inbox.`,
      });
    } catch (error) {
      // If email fails, clear reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // Validate password inputs
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both password and confirm password",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Hash token received from URL
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user with valid token and expiry time
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or has expired",
      });
    }

    // Update user's password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been updated successfully. Redirecting to login...",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createUnlockKey = async (req, res) => {
  try {
    const { amount } = req.body;
    const generateCourseKey = () => {
      return crypto.createHash('sha256').update(process.env.JWT_SECRET).digest('hex');
    };
    //get user from req.user 
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //save key into user model
    user.unlockeKey = generateCourseKey();
    let expireTime;
    if (amount === 199900) {
      expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
    } else if (amount === 499900) {
      expireTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
    } else if (amount === 999900) {
      expireTime = null;
    } else {
      expireTime = Date.now() + 24 * 60 * 60 * 1000; // default
    }
    user.unlockKeyExpire = expireTime;
    res.status(200).json({
      success: true,
      unlockeKey: user.unlockeKey,
      message: "Courses unlocked successfully Created",
    });
    await user.save();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};
exports.validatePayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }
  const generateCourseKey = () => {
    return crypto.createHash('sha256').update(process.env.JWT_SECRET).digest('hex');
  };
  //get user from req.user 
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  //save key into user model
  user.unlockeKey = generateCourseKey();
  let expireTime;
  if (amount === 199900) {
    expireTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
  } else if (amount === 499900) {
    expireTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
  } else if (amount === 999900) {
    expireTime = null;
  } else {
    expireTime = Date.now() + 24 * 60 * 60 * 1000; // default
  }
  user.unlockKeyExpire = expireTime;
  await user.save();
  res.json({
    msg: "success",
    success: true,
    unlockeKey: user.unlockeKey,
    message: "Courses unlocked successfully Created",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
};

//