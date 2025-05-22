import axios from 'axios';

export const callGeminiAPI = async (message, conversationHistory) => {
  try {
    console.log("conversationHistory", conversationHistory);
    const response = await axios.post("http://localhost:5000/api/support/chatbot", { 
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
