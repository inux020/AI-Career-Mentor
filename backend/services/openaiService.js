require("dotenv").config();
const OpenAI = require("openai");

// Groq offers a free, OpenAI-compatible API — same SDK, different base URL.
// If you later switch to real OpenAI, just remove the baseURL line and
// swap the .env values.
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.groq.com/openai/v1",
});

const MODEL = process.env.OPENAI_MODEL || "llama-3.3-70b-versatile";

/**
 * Sends a prompt to the AI provider and returns the parsed JSON response.
 * @param {string} systemPrompt - instructions/context for the model
 * @param {string} userPrompt - the actual data/question
 */
async function getStructuredCompletion(systemPrompt, userPrompt) {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("AI service error:", error.message);
    throw new Error("Failed to get a response from the AI service");
  }
}

module.exports = { getStructuredCompletion };
