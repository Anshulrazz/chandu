const Consultation = require("../models/Consultation");

exports.createConsultation = async (req, res) => {
  try {
    const { name, email, phone, experience, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    const consultation = await Consultation.create({
      name,
      email,
      phone,
      experience,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Consultation request submitted successfully",
      consultation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      consultations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
