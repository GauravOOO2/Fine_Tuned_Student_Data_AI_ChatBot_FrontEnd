import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChatHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_CHAT_HISTORY_URL); // Use the environment variable
        console.log("Fetched history:", response.data); // Debugging
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
  
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <h1 className="text-xl font-semibold">Chat History</h1>
      <div className="mt-4 space-y-2 flex-1 overflow-auto">
        {history.map((chat) => (
          <div key={chat._id} className="flex flex-col space-y-2 border-b border-gray-300 pb-2 mb-2">
            <span className="text-xs text-gray-500">{new Date(chat.timestamp).toLocaleString()}</span>
            {chat.messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg shadow-md transition-all duration-300 ease-in-out ${msg.sender === 'user' ? 'bg-white text-gray-800 rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatHistory;
