import { MessageBubble } from './MessageBubble';

export function ChatContainer({ messages }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
    </div>
  );
}