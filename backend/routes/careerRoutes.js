const express = require("express");
const router = express.Router();

const { recommendCareers, generateRoadmap } = require("../controllers/careerController");

router.post("/recommendations", recommendCareers);
router.post("/roadmap", generateRoadmap);

module.exports = router;
