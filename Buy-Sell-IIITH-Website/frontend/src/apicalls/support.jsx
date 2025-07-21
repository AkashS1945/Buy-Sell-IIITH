import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const callGeminiAPI = async (message, conversationHistory) => {
  try {
    console.log("conversationHistory", conversationHistory);
    const response = await axios.post(`${API_BASE_URL}/api/support/chatbot`, { 
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