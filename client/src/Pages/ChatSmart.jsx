import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import axios from '../utils/axiosInstance';
import { ChatInput } from '../Components';
import robotAvatar from '../assets/robot.png';
import { MessageBubble } from '../Components/MessageBubble';

export function ChatSmart() {
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const containerEndRef = useRef(null);
  const { user, token } = useUserStore();

  // 🔄 Fetch chat list and latest chat
  useEffect(() => {
    if (!user || !token) return;

    const fetchChatList = async () => {
      try {
        const res = await axios.get('/chat/history/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChatList(res.data.chats || []);

        if (res.data.chats.length > 0) {
          const latest = res.data.chats[0];
          const fullChat = await axios.get(`/chat/${latest._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(fullChat.data.chat?.messages || []);
          setCurrentChatId(latest._id);
        }
      } catch (err) {
        console.error('Error fetching chat list:', err);
      }
    };

    fetchChatList();
  }, [user, token]);

  // ➕ Start new chat
  const handleNewChat = async () => {
    try {
      const res = await axios.post('/chat/new', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.chatId) {
        setMessages([]);
        setCurrentChatId(res.data.chatId);

        const updated = await axios.get('/chat/history/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatList(updated.data.chats || []);
      }
    } catch (err) {
      console.error('Error creating new chat:', err);
    }
  };

  // ✉️ Send user message to RAG system
  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await axios.post('/rag', {
        query: text,
        chatId: currentChatId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { reply, chatId } = res.data;

      setMessages([...newMessages, reply]);
      setCurrentChatId(chatId);

      setChatList(prev =>
        prev.map(chat =>
          chat._id === chatId
            ? { ...chat, preview: text, updatedAt: new Date().toISOString() }
            : chat
        )
      );
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Something went wrong 🤖' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (containerEndRef.current) {
      containerEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 📦 Load previous chat
  const loadChat = async (chatId) => {
    try {
      const res = await axios.get(`/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.chat?.messages || []);
      setCurrentChatId(chatId);
    } catch (err) {
      console.error('Error loading chat:', err);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6">
      {/* Chat box */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div className="absolute inset-0 pointer-events-none flex justify-center items-start opacity-10 z-0">
          <img src={robotAvatar} alt="robot" className="w-[300px] h-auto object-contain" />
        </div>

        <div className="flex-1 overflow-y-auto bg-transparent px-6 pt-6 pb-8 custom-scrollbar z-10">
          <div className="space-y-4">
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
          </div>
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

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[215px] rounded-2xl p-4 bg-white/20 dark:bg-black/30 backdrop-blur-lg shadow-md h-full overflow-y-auto">
        <h3 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-white">Chat History</h3>

        <button
          onClick={handleNewChat}
          className="text-sm font-medium text-blue-600 hover:underline mb-3"
        >
          + New Chat
        </button>

        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
          {chatList.map((chat) => (
            <li
              key={chat._id}
              onClick={() => loadChat(chat._id)}
              className="truncate cursor-pointer hover:text-blue-600"
            >
              {chat.preview || chat.messages?.[0]?.content || 'Empty Chat'}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
