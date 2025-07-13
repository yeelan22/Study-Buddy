import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import axios from '../utils/axiosInstance';
import { ChatHeader, ChatInput, ChatContainer } from '../Components';
import robotAvatar from '../assets/robot.png';

export function ChatSmart() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const containerEndRef = useRef(null);
  const { user, token } = useUserStore();

  // 🧠 Load latest chat history if logged in
  useEffect(() => {
    if (!user || !token) return;

    const fetchChatHistory = async () => {
      try {
        const res = await axios.get('/chat/history/latest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data && res.data.chat) {
          setMessages(res.data.chat.messages);
          setCurrentChatId(res.data.chat._id);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchChatHistory();
  }, [user, token]);

  const sendMessage = async (text) => {
  const newMessages = [...messages, { role: 'user', content: text }];
  setMessages(newMessages);
  setIsLoading(true);

  try {
    const res = await axios.post(
      '/rag', // changed from '/chat'
      { query: text }, // only send the user query to RAG
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // RAG returns { role, content } message directly
    setMessages([...newMessages, res.data]);
  } catch (err) {
    console.error(err);
    setMessages([
      ...newMessages,
      { role: 'assistant', content: 'Something went wrong 🤖' },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (containerEndRef.current) {
      containerEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] p-4 rounded-2xl overflow-hidden flex text-[15px]">
      <div className="relative flex flex-col flex-1 h-full overflow-hidden glass rounded-2xl z-0 shadow-xl">
        <ChatHeader />

        <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-20 z-0">
          <img src={robotAvatar} alt="robot-bg" className="w-[320px] h-auto object-contain" />
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 pt-6 pb-8 custom-scrollbar z-10">
          <ChatContainer messages={messages} />
          <div ref={containerEndRef} />
        </div>

        <ChatInput onSend={sendMessage} />

        {isLoading && (
          <img
            src={robotAvatar}
            alt="bot-thinking"
            className="absolute left-8 bottom-28 h-10 w-10 animate-bounce z-30 opacity-90"
          />
        )}
      </div>
    </div>
  );
}
