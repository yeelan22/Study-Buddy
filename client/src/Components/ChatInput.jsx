import { useRef, useState } from 'react';
import gsap from 'gsap';

export function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const inputRef = useRef();

  const handleSend = () => {
    if (!text.trim()) {
      gsap.fromTo(inputRef.current, { x: 0 }, { x: -10, duration: 0.1, repeat: 3, yoyo: true });
      return;
    }

    onSend(text);
    setText('');
  };

  return (
    <div className="px-6 py-3 backdrop-blur-sm bg-zinc-100/30 dark:bg-zinc-800/50 flex items-center gap-2 shadow-inner border-t border-zinc-300/20 dark:border-zinc-700">
      <input
        ref={inputRef}
        className="flex-1 rounded-full bg-white/30 dark:bg-zinc-700 text-zinc-800 dark:text-white px-5 py-2 focus:outline-none backdrop-blur-md placeholder:text-zinc-400"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue text-white px-4 py-2 rounded-full hover:scale-105 transition shadow-md"
      >
        Send
      </button>
    </div>
  );
}