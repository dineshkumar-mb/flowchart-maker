import { GoogleGenerativeAI } from "@google/generative-ai";

// Use import.meta.env for Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key is not set in .env or .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeTextWithGemini(prompt, text) {
  try {
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`${prompt}\n\nText to analyze: ${text}`);

    // Correct way to get text from response
    const generatedText = result.response.candidates?.[0]?.content?.parts
      ?.map(part => part.text)
      .join(' ') || '';

    return generatedText;
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return `Error analyzing text: ${error.message}`;
  }
}
