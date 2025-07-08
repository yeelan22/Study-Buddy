import { MessageBubble } from '../Components';
export function ChatContainer({ messages = [] }) {
  return (
    <div className="flex-1 px-6 py-4 overflow-y-auto space-y-1 custom-scrollbar">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
    </div>
  );
}
