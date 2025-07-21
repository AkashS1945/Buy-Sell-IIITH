import React, { useState, useEffect, useRef } from 'react';
import { 
  Input, 
  Button, 
  Typography, 
  Card, 
  Avatar, 
  message,
  Spin,
  Divider
} from 'antd';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined, 
  CustomerServiceOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { callGeminiAPI } from '../../apicalls/support';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const welcomeMessage = {
      text: "Hello! I'm your AI support assistant. I'm here to help you with any questions",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === '' || loading) return;

    const newUserMessage = { 
      text: userInput.trim(), 
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);
    setIsTyping(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    try {
      const botReply = await callGeminiAPI(userInput.trim(), updatedMessages);
      
      setIsTyping(false);
      
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            text: botReply, 
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }, 500);

    } catch (error) {
      console.error('Error with chatbot:', error);
      setIsTyping(false);
      
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment or contact our support team directly.",
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }
      ]);
      
      message.error('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const MessageBubble = ({ msg, index }) => {
    const isUser = msg.sender === 'user';
    const isBot = msg.sender === 'bot';
    
    return (
      <div 
        className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {isBot && (
          <div className="flex-shrink-0 mr-3">
            <Avatar 
              size={36}
              className={`${msg.isError ? 'bg-red-500' : 'bg-blue-500'}`}
              icon={<RobotOutlined />}
            />
          </div>
        )}
        
        <div className={`max-w-[85%] sm:max-w-[70%] ${isUser ? 'order-1' : ''}`}>
          <div
            className={`
              p-3 rounded-2xl shadow-sm
              ${isUser 
                ? 'bg-indigo-600 text-white rounded-br-md' 
                : msg.isError
                ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-md'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
              }
            `}
          >
            <Text className={`${isUser ? 'text-white' : msg.isError ? 'text-red-800' : 'text-gray-800'} whitespace-pre-wrap break-words`}>
              {msg.text}
            </Text>
          </div>
          
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0 ml-3">
            <Avatar 
              size={36}
              className="bg-indigo-500"
              icon={<UserOutlined />}
            />
          </div>
        )}
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="flex-shrink-0 mr-3">
        <Avatar 
          size={36}
          className="bg-blue-500"
          icon={<RobotOutlined />}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-3 shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CustomerServiceOutlined className="text-white text-2xl" />
            </div>
          </div>
          <Title level={2} className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Support Chat
          </Title>
          <Text className="text-gray-600">
            Get help from our AI assistant
          </Text>
        </div>

        {/* Chat Container */}
        <Card 
          className="shadow-xl border-0 overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar 
                  size={40}
                  className="bg-white bg-opacity-20"
                  icon={<RobotOutlined className="text-white" />}
                />
                <div>
                  <Title level={5} className="text-white mb-0">AI Support Assistant</Title>
                  <Text className="text-blue-100 text-sm">
                    {isTyping ? 'Typing...' : 'Online'}
                  </Text>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Text className="text-blue-100 text-sm hidden sm:inline">Active</Text>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={messageListRef}
            className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 bg-gray-50"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.5'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageOutlined className="text-4xl text-gray-300 mb-4" />
                  <Text className="text-gray-500">Start a conversation...</Text>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <MessageBubble key={index} msg={msg} index={index} />
                ))}
                {isTyping && <TypingIndicator />}
              </>
            )}
          </div>

          <Divider className="m-0" />

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <TextArea
                  ref={inputRef}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="resize-none"
                  maxLength={1000}
                  showCount
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  loading={loading}
                  disabled={loading || userInput.trim() === ''}
                  icon={loading ? <Spin size="small" /> : <SendOutlined />}
                  className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 min-w-[100px] sm:min-w-[120px]"
                >
                  <span className="hidden sm:inline">
                    {loading ? 'Sending...' : 'Send'}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card 
            className="text-center hover:shadow-md transition-shadow cursor-pointer border-gray-200"
            onClick={() => setUserInput("How do I buy a product?")}
            styles={{ body: { padding: '16px' } }}
          >
            <div className="text-blue-600 text-2xl mb-2">How to Buy</div>
            <Text className="font-medium">How to Buy</Text>
          </Card>
          
          <Card 
            className="text-center hover:shadow-md transition-shadow cursor-pointer border-gray-200"
            onClick={() => setUserInput("How do I sell a product?")}
            styles={{ body: { padding: '16px' } }}
          >
            <div className="text-green-600 text-2xl mb-2">How to Sell</div>
            <Text className="font-medium">How to Sell</Text>
          </Card>
          
          <Card 
            className="text-center hover:shadow-md transition-shadow cursor-pointer border-gray-200"
            onClick={() => setUserInput("I need help with my order")}
            styles={{ body: { padding: '16px' } }}
          >
            <div className="text-orange-600 text-2xl mb-2">Order Help</div>
            <Text className="font-medium">Order Help</Text>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;