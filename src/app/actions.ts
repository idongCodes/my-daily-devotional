"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getVerseContext(reference: string, text: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "GEMINI_API_KEY is not set in environment variables."
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Provide a detailed, spiritual, and historical context for the Bible verse: ${reference} - "${text}". Explain its meaning and application for a daily devotional. Keep the tone encouraging and instructional. Limit the response to around 500 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return {
      success: true,
      data: summary
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: "Failed to generate context."
    };
  }
}
