import { motion } from 'framer-motion';
import profile from '../assets/profile.jpg'
import robot from '../assets/robot.png';
export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end mr-2' : 'ml-2'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-600 overflow-hidden">
          {/* Placeholder for avatar */}
          <img src={robot} alt="avatar" className="w-full h-full object-cover" />
        </div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`
          px-4 py-3 rounded-2xl shadow-md max-w-[75%]
          ${isUser
          ? 'bg-blue text-white rounded-br-none'
          : 'bg-white/10 dark:text-white backdrop-blur-md text-zinc-800 border border-zinc-200 shadow-sm rounded-bl-none'}
        `}>
        {message.content}
      </motion.div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-zinc-500 dark:bg-zinc-700 overflow-hidden">
          {/* Placeholder for user avatar */}
          <img src={profile} alt="avatar" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}