import axios from 'axios';

const BASE_URL = "http://localhost:5000";

export const callGeminiAPI = async (message, conversationHistory) => {
  try {
    console.log("conversationHistory", conversationHistory);
    const response = await axios.post(`${BASE_URL}/api/support/chatbot`, { 
      message: message, 
      conversationHistory: conversationHistory 
    });
    return response.data.botReply || "I couldn't generate a response.";
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    console.log("Error here.");
    return "Error communicating with the chatbot.";

  }
};
