import React, { useState } from 'react';
import './chatbot.css'

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! What’s your study goal for today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { from: 'user', text: input };
  setMessages((prev) => [...prev, userMessage]);

  const botReply = await generateBotReply(input);
  setMessages((prev) => [...prev, botReply]);
  setInput('');
};

 

 const generateBotReply = async (msg) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a friendly study assistant chatbot.' },
          { role: 'user', content: msg }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', errorText);
      return { from: 'bot', text: '⚠️ API error: ' + errorText };
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('Unexpected response format:', data);
      return { from: 'bot', text: '⚠️ Unexpected response format. Try again!' };
    }

    return { from: 'bot', text: data.choices[0].message.content };
  } catch (error) {
    console.error('Fetch error:', error);
    return { from: 'bot', text: '⚠️ Network error. Please check your connection.' };
  }
};

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>📚 Study Buddy Bot</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'bot' ? 'left' : 'right', margin: '5px 0' }}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ width: '100%', padding: '10px', marginTop: '10px' }}
      />
      <button onClick={handleSend} style={{ marginTop: '10px', padding: '10px 20px' }}>
        Send
      </button>
    </div>
    
  );
};



export default ChatBot;