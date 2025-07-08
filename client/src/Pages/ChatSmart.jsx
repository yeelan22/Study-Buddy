// src/Pages/ChatSmart.jsx
import { ChatHeader, ChatContainer, ChatInput } from '../Components';
import robot from '../assets/robot.png';
import { useState } from 'react';

export function ChatSmart() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const botReply = data.choices?.[0]?.message;

      setMessages([...newMessages, botReply]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Something went wrong 🤖' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden md:flex-row  max-w-full rounded-xl">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatContainer messages={messages} />
        <ChatInput onSend={sendMessage} />
      </div>

      {/* Static Right Chat Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] min-w-[280px] shrink-0 border-l border-zinc-200 dark:border-zinc-700 px-4 py-6">
        <h3 className="text-lg font-semibold mb-4">Recent Chats</h3>
        <div className="text-sm space-y-4">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Today</p>
            <ul className="ml-4 mt-1 space-y-1 text-zinc-800 dark:text-white">
              <li>- Study Assistant</li>
              <li>- Morning Journal 🌞</li>
            </ul>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Yesterday</p>
            <ul className="ml-4 mt-1 space-y-1 text-zinc-800 dark:text-white">
              <li>- Project Plan</li>
              <li>- Arabic Vocabulary</li>
            </ul>
          </div>
        </div>
      </aside>

      {isLoading && (
        <img
          src={robot}
          alt="bot"
          className="absolute bottom-24 left-4 h-12 w-12 rounded-full animate-bounce z-50"
        />
      )}
    </div>
  );
}