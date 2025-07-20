import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post('/chatbot', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    console.log("Contents being sent:", JSON.stringify(contents, null, 2));

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent({
      contents
    });

    const botReply = result.response.candidates?.[0]?.content?.parts?.[0]?.text
      || "I'm not sure how to respond to that. Could you please rephrase your question?";

    res.status(200).json({ 
      success: true, 
      botReply: botReply.trim()
    });

  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ 
      success: false, 
      message: "I'm experiencing some technical difficulties. Please try again in a moment." 
    });
  }
});

export default router;