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

    // console.log("Message:", message);
    // console.log("Conversation History:", conversationHistory);

    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    console.log("Formatted History:", JSON.stringify(formattedHistory, null, 2));

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: formattedHistory
    });

    const botReply = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";

    // console.log("Bot Reply:", botReply);
    res.status(200).json({ botReply });

  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ message: "Error communicating with AI" });
  }
});

export default router;
