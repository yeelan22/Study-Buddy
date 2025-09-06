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
    <div className="w-full px-2 sm:px-4 md:pb-2 pb-4 ">
  <div className="flex w-full items-center gap-3 rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 shadow-sm p-2">
    <input
      ref={inputRef}
      type="text"
      placeholder="Type your message..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      className="flex-1 px-4 py-2 text-sm bg-transparent outline-none text-gray-800 dark:text-white placeholder:text-sm placeholder:text-gray-400"
    />
    <button
      onClick={handleSend}
      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
    >
      Send
    </button>
  </div>
</div>
  );
}