const express = require("express");
const router = express.Router();

const {
  createConsultation,
  getAllConsultations,
} = require("../cantroller/consultationController");

router.post("/consulte", createConsultation);
router.get("/consultations", getAllConsultations);

module.exports = router;

