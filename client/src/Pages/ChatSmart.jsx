import { ChatHeader, ChatInput, ChatContainer } from '../Components';
import { useState, useRef, useEffect } from 'react';
import robotAvatar from '../assets/robot.png';
import { useNoteStore } from '../store/noteStore';

export function ChatSmart() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const containerEndRef = useRef(null);

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
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Something went wrong 🤖' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll into view
  useEffect(() => {
    if (containerEndRef.current) {
      containerEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const notes = useNoteStore((state) => state.notes);
  return (
    <div className="relative w-full h-[calc(100vh-80px)] p-4 rounded-2xl overflow-hidden flex text-[15px]">
      {/* Chat Layout */}
      <div className="relative flex flex-col flex-1 h-full overflow-hidden glass rounded-2xl z-0 shadow-xl">

        {/* 🌫️ Header */}
        <ChatHeader />

        {/* 🤖 Robot Background */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-20 z-0">
          <img src={robotAvatar} alt="robot-bg" className="w-[320px] h-auto object-contain" />
        </div>

        {/* 📱 Chat content scrollable */}
        <div className="relative flex-1 overflow-y-auto px-4 pt-6 pb-8 custom-scrollbar z-10">
          <ChatContainer messages={messages} />
          <div ref={containerEndRef} />
        </div>

        {/* 🧠 Input (Sticky to Chat Area Only) */}
          <ChatInput onSend={sendMessage} />

        {/* 🤖 Loading Bounce (at reply zone) */}
        {isLoading && (
          <img
            src={robotAvatar}
            alt="bot-thinking"
            className="absolute left-8 bottom-28 h-10 w-10 animate-bounce z-30 opacity-90"
          />
        )}
      </div>

      {/* 📜 Chat History Sidebar (Fixed) */}
      <aside className={`hidden lg:flex flex-col w-[280px] shrink-0 p-6 ml-4 rounded-3xl  h-full z-20 glass`}>
        <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-white">Recent Chats</h3>
        <div className="text-sm space-y-4 text-zinc-700 dark:text-zinc-200">
          <div>
            <p className="text-xs text-zinc-500">Today</p>
            <ul className="ml-3 mt-1 space-y-1">
              <li>- Study Assistant</li>
              <li>- Morning Journal 🌞</li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Yesterday</p>
            <ul className="ml-3 mt-1 space-y-1">
              <li>- Project Plan</li>
              <li>- Arabic Vocabulary</li>
            </ul>
          </div>
        </div>
      </aside>

    </div>
  );
}