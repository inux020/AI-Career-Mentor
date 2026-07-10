const { getStructuredCompletion } = require("./openaiService");

/**
 * Generates career path recommendations based on a student's profile.
 * @param {object} profile - { education, skills[], interests[], strengths[], goals }
 */
async function getCareerRecommendations(profile) {
  const systemPrompt = `You are an expert career counselor AI. Given a student's profile,
recommend suitable career paths. Respond ONLY with valid JSON, no extra text, in this exact shape:

{
  "recommendations": [
    {
      "careerTitle": "string",
      "matchScore": number (0-100),
      "reason": "string, 2-3 sentences explaining the fit",
      "requiredSkills": ["string"],
      "industryOutlook": "string, brief note on demand/growth"
    }
  ]
}

Return 3-5 recommendations, ranked by matchScore descending.`;

  const userPrompt = `Student Profile:
- Education: ${profile.education || "Not specified"}
- Skills: ${(profile.skills || []).join(", ") || "Not specified"}
- Interests: ${(profile.interests || []).join(", ") || "Not specified"}
- Strengths: ${(profile.strengths || []).join(", ") || "Not specified"}
- Career Goals: ${profile.goals || "Not specified"}

Based on this profile, recommend suitable career paths.`;

  return getStructuredCompletion(systemPrompt, userPrompt);
}

/**
 * Generates a learning roadmap toward a specific career.
 * @param {object} params - { careerTitle, currentSkills[], timeframeMonths }
 */
async function getLearningRoadmap(params) {
  const systemPrompt = `You are an expert learning-path designer AI. Given a target career and
a learner's current skills, generate a step-by-step learning roadmap. Respond ONLY with valid
JSON, no extra text, in this exact shape:

{
  "careerTitle": "string",
  "estimatedDurationMonths": number,
  "milestones": [
    {
      "stage": "string, e.g. 'Foundation', 'Intermediate', 'Advanced'",
      "skillsToLearn": ["string"],
      "recommendedCourses": ["string"],
      "certifications": ["string"],
      "estimatedWeeks": number
    }
  ]
}`;

  const userPrompt = `Target Career: ${params.careerTitle}
Current Skills: ${(params.currentSkills || []).join(", ") || "None specified"}
Preferred Timeframe: ${params.timeframeMonths ? params.timeframeMonths + " months" : "Not specified"}

Generate a personalized learning roadmap to help this student reach the target career.`;

  return getStructuredCompletion(systemPrompt, userPrompt);
}

module.exports = { getCareerRecommendations, getLearningRoadmap };
