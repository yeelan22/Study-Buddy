import { useState } from 'react';
import { ChatHeader, ChatContainer, ChatInput } from '../Components';

export function ChatSmart() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! How can I help you today?' }
  ]);

  const sendMessage = async (userMsg) => {
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);

    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    const botReply = data.choices?.[0]?.message;

    setMessages([...newMessages, botReply]);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <ChatContainer messages={messages} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
