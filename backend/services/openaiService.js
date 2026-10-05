require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-key",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.groq.com/openai/v1",
});

const MODEL = process.env.OPENAI_MODEL || "llama-3.3-70b-versatile";

function parseKeywords(text = "") {
  return text
    .toLowerCase()
    .split(/[\s,]+/)
    .map((item) => item.replace(/[^a-z]/g, ""))
    .filter(Boolean)
    .slice(0, 10);
}

function createFallbackResponse(systemPrompt, userPrompt) {
  const promptText = userPrompt.toLowerCase();
  const lower = promptText;

  if (lower.includes("target career") || lower.includes("generate a personalized learning roadmap")) {
    const careerTitle = /target career:\s*([^\n]+)/i.exec(userPrompt)?.[1]?.trim() || "Software Developer";
    const currentSkills = /current skills:\s*([^\n]+)/i.exec(userPrompt)?.[1]?.trim() || "HTML, CSS, JavaScript";
    const timeframeMonths = /preferred timeframe:\s*(\d+)/i.exec(userPrompt)?.[1] || "6";

    const skillsList = currentSkills.split(",").map((item) => item.trim()).filter(Boolean);
    return {
      careerTitle,
      estimatedDurationMonths: Number(timeframeMonths),
      milestones: [
        {
          stage: "Foundation",
          skillsToLearn: ["Core programming concepts", "Version control", ...skillsList.slice(0, 2)],
          recommendedCourses: ["Intro to Programming", "Git Basics", "Web Fundamentals"],
          certifications: ["Google IT Support", "FreeCodeCamp Frontend Certificate"],
          estimatedWeeks: 4,
        },
        {
          stage: "Intermediate",
          skillsToLearn: ["Data structures", "APIs", "Debugging", "Testing"],
          recommendedCourses: ["JavaScript Algorithms", "API Design", "Testing Fundamentals"],
          certifications: ["Meta Front-End Developer", "AWS Cloud Practitioner"],
          estimatedWeeks: 6,
        },
        {
          stage: "Advanced",
          skillsToLearn: ["System design", "Project architecture", "Portfolio building"],
          recommendedCourses: ["System Design", "Full-Stack Capstone", "Career Portfolio Workshop"],
          certifications: ["Professional Certificate in Relevant Domain"],
          estimatedWeeks: 8,
        },
      ],
    };
  }

  const keywords = parseKeywords(userPrompt);
  const hasData = keywords.some((word) => ["data", "analysis", "sql", "python"].includes(word));
  const hasDesign = keywords.some((word) => ["design", "ui", "ux", "creative"].includes(word));
  const hasHealth = keywords.some((word) => ["health", "biology", "medical", "research"].includes(word));

  const recommendations = [
    {
      careerTitle: hasData ? "Data Analyst" : hasDesign ? "UX/UI Designer" : hasHealth ? "Healthcare Analyst" : "Software Developer",
      matchScore: 92,
      reason: "Your profile shows a strong base for problem-solving and hands-on work. This role fits well with your current strengths and future goals.",
      requiredSkills: ["Analytical thinking", "Communication", "Technical tools", "Adaptability"],
      industryOutlook: "Strong demand in digital and service industries with good long-term growth.",
    },
    {
      careerTitle: hasData ? "Business Analyst" : hasDesign ? "Product Designer" : hasHealth ? "Medical Research Coordinator" : "Full-Stack Developer",
      matchScore: 88,
      reason: "This path connects your interests to a practical role that values creativity, structured thinking, and execution.",
      requiredSkills: ["Project planning", "Collaboration", "User understanding", "Technical fundamentals"],
      industryOutlook: "Consistently in demand as companies invest in digital tools and operations.",
    },
    {
      careerTitle: hasData ? "Product Analyst" : hasDesign ? "Graphic Designer" : hasHealth ? "Health Informatics Specialist" : "Frontend Developer",
      matchScore: 84,
      reason: "This role is a good fit if you enjoy learning, improving user experiences, and turning ideas into visible outcomes.",
      requiredSkills: ["Design thinking", "Presentation", "Research", "Continuous learning"],
      industryOutlook: "Growing across startups, agencies, technology, and public services.",
    },
  ];

  return { recommendations };
}

async function getStructuredCompletion(systemPrompt, userPrompt) {
  try {
    const hasApiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "demo-key");
    if (!hasApiKey) {
      return createFallbackResponse(systemPrompt, userPrompt);
    }

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      return createFallbackResponse(systemPrompt, userPrompt);
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("AI service error:", error.message);
    return createFallbackResponse(systemPrompt, userPrompt);
  }
}

module.exports = { getStructuredCompletion };
