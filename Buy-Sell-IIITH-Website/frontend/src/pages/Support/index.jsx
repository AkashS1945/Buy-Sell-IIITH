import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Spin } from 'antd'; 
import { callGeminiAPI } from '../../apicalls/support'; 

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;
  
    const newUserMessage = { text: userInput, sender: 'user' };
  
    const updatedMessages = [...messages, newUserMessage];
  
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);
  
    console.log('Updated Messages Before API Call:', updatedMessages);
  
    try {
      const botReply = await callGeminiAPI(userInput, updatedMessages);
      console.log('Bot Reply:', botReply);
  
      setMessages(prevMessages => [
        ...prevMessages,
        { text: botReply, sender: 'bot' }
      ]);
    } catch (error) {
      console.error('Error with chatbot:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="support-container bg-gray-100 min-h-screen p-4"> 
      <div className="chat-window bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[500px]" ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender} mb-2 p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-input flex mt-4">
        <Input
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow rounded-l-md"
        />
        <Button type="primary" htmlType="submit" className="rounded-r-md" disabled={loading}>
          {loading ? <Spin size="small" /> : "Send"}
        </Button>
      </form>
    </div>
  );
};

export default Support;
