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

    // Enhanced system prompt for better marketplace context
    const systemPrompt = `You are a helpful AI assistant for "Buy/Sell IIITH", a marketplace platform for IIIT Hyderabad students and staff. 

Key features of our platform:
- Users can buy and sell products with categories like electronics, furniture, clothing, books, beauty, sports, grocery, and others
- Secure authentication with IIIT email addresses only
- Product listings with detailed information including age, condition, warranty status, original box availability
- Shopping cart functionality and order management
- OTP-based order verification for secure transactions
- User profiles with seller ratings and reviews
- AI-powered support chat (that's you!)

Common topics users ask about:
1. How to register/login (IIIT email required)
2. How to list products for sale
3. How to buy products and use cart
4. Order tracking and OTP verification
5. Profile management
6. Account security
7. Payment and transaction process
8. Product categories and search

Always be helpful, friendly, and provide specific guidance. If users have technical issues, suggest they contact support directly. Keep responses concise but informative.`;

    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const contents = [
      { role: 'model', parts: [{ text: systemPrompt }] },
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