import { MessageBubble } from "../Components";

export function ChatContainer({ messages }) {
  return (
    <div className="flex-1 px-4 overflow-y-auto py-6">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
    </div>
  );
}
