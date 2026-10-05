const express = require("express");
const router = express.Router();
const { getLearningRoadmap } = require("../services/recommendationService");

router.post("/generate", async (req, res) => {
  try {
    const result = await getLearningRoadmap(req.body || {});
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate roadmap." });
  }
});

module.exports = router;
