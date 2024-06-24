import React, { useState } from 'react';
import "./chatbot.css";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const toggleOpen = (e) => {
    e.stopPropagation(); // Prevent toggling when clicking inside the chat window
    setOpen(!open);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === '') return;

    const userMessage = userInput;
    setChatHistory([...chatHistory, { sender: 'user', message: userMessage }]);
    setUserInput('');

    try {
      const response = await fetch('http://yourserver.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory([...chatHistory, { sender: 'user', message: userMessage }, { sender: 'bot', message: data.reply }]);
      } else {
        console.error('Error fetching response from server.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`chatbot-container ${open ? 'open' : ''}`} onClick={toggleOpen}>
      {open && (
        <div className="chatbot-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={toggleOpen}>×</button>
          <h3>ChatBot</h3>
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <p key={index} className={chat.sender === 'user' ? 'user-message' : 'bot-message'}>
                {chat.message}
              </p>
            ))}
          </div>
          <form onSubmit={handleFormSubmit}>
            <input type="text" value={userInput} onChange={handleInputChange} />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
