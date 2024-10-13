import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { Mic, Paperclip, Send, Menu, HelpCircle } from 'lucide-react';
import axios from 'axios';

function ChatbotUI() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user'
      };
      setChatMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsLoading(true);

      try {
        const response = await axios.post(process.env.REACT_APP_GENERATE_CONTENT_URL, { // Use the environment variable
          prompt: message
        });

        const botResponse = {
          id: Date.now() + 1,
          text: response.data.generated_text,
          sender: 'bot'
        };
        setChatMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('Error generating content:', error);
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          sender: 'bot'
        };
        setChatMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          <Menu className="h-5 w-5 mr-2" />
          Menu
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">ChatBot</h1>
        <div className="flex items-center space-x-2">
          <Link to="/history"> {/* Wrap the History button in a Link */}
            <Button variant="outline" className="text-gray-600 hover:text-gray-900">
              History
            </Button>
          </Link>
          <Link to="/help"> {/* Wrap the HelpCircle in a Link */}
            <Button variant="outline" className="text-gray-600 hover:text-gray-900 rounded-full p-0">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Chat area */}
      <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                msg.sender === 'user'
                  ? 'bg-white text-gray-800 rounded-br-none'
                  : 'bg-gray-700 text-white rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white p-3 rounded-lg shadow-md rounded-bl-none">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Add file</span>
          </Button>
          <Input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent border-none focus:ring-0"
          />
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice input</span>
          </Button>
          <Button 
            onClick={handleSend} 
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotUI;
