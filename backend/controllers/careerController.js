const { getCareerRecommendations, getLearningRoadmap } = require("../services/recommendationService");

/**
 * POST /api/career/recommendations
 * Body: { education, skills[], interests[], strengths[], goals }
 */
async function recommendCareers(req, res) {
  try {
    const profile = req.body;

    if (!profile || (!profile.skills && !profile.interests)) {
      return res.status(400).json({
        error: "Please provide at least skills or interests in the request body.",
      });
    }

    const result = await getCareerRecommendations(profile);
    res.json(result);
  } catch (error) {
    console.error("Error in recommendCareers:", error.message);
    res.status(500).json({ error: "Failed to generate career recommendations." });
  }
}

/**
 * POST /api/career/roadmap
 * Body: { careerTitle, currentSkills[], timeframeMonths }
 */
async function generateRoadmap(req, res) {
  try {
    const params = req.body;

    if (!params || !params.careerTitle) {
      return res.status(400).json({ error: "Please provide a careerTitle in the request body." });
    }

    const result = await getLearningRoadmap(params);
    res.json(result);
  } catch (error) {
    console.error("Error in generateRoadmap:", error.message);
    res.status(500).json({ error: "Failed to generate learning roadmap." });
  }
}

module.exports = { recommendCareers, generateRoadmap };
