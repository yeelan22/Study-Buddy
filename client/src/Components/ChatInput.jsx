import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
export function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const inputRef = useRef();

  const handleSend = () => {
    if (!text.trim()) {
      gsap.fromTo(inputRef.current, { x: 0 }, {
        x: -10, duration: 0.1, repeat: 3, yoyo: true
      });
      return;
    }
    onSend(text);
    setText('');
  };

  return (
    <div className="max-w-xl w-full mx-6 mb-2 flex gap-3 items-center">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        className="flex-1 rounded-full px-5 py-3 bg-white dark:bg-zinc-800/10 outline-none
         text-gray-800 dark:text-white placeholder:text-sm placeholder:text-zinc-400 shadow-inner backdrop-blur-md border
          border-zinc-300"
      />
      <button
        onClick={handleSend}
        className="bg-blue text-white px-5 py-2 rounded-full hover:scale-[1.03] transition shadow"
      >
        Send
      </button>
    </div>
  );
}