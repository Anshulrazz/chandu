const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  try {
    // Create transporter with explicit SSL configuration for Hostinger
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true, // Always true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Required for Hostinger
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
      }
    });

    // Verify SMTP connection configuration
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const mailOptions = {
      from: {
        name: "Samraat Trader",
        address: process.env.SMTP_USER
      },
      to: options.email,
      subject: options.subject,
      html: options.message,
      headers: {
        'X-Priority': '1', // High priority 
        'X-MSMail-Priority': 'High' 
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    if (error.code === 'EAUTH') {
      throw new Error("Authentication failed. Please check your email credentials.");
    } else if (error.code === 'ESOCKET') {
      throw new Error("Failed to connect to email server. Please check your SMTP settings.");
    } else {
      throw new Error(`Email could not be sent: ${error.message}`);
    }
  }
};

module.exports = sendEmail; 