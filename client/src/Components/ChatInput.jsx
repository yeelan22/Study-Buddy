import { useRef, useState } from 'react';
import gsap from 'gsap';

export function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const inputRef = useRef();

  const handleSend = () => {
    if (!text.trim()) {
      gsap.to(inputRef.current, {
        x: -10,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
      });
      return;
    }

    onSend(text);
    setText('');
  };

  return (
    <div className="px-4 py-3 border-t dark:border-zinc-700 flex items-center gap-2">
      <input
        ref={inputRef}
        className="flex-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 focus:outline-none"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        className="bg-blue text-white px-4 py-2 rounded-lg hover:scale-105 transition"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
