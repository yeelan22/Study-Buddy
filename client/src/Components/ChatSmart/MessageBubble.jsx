import { motion } from 'framer-motion';
import robot from '../../assets/robot.png';
import { useUserStore } from '../../store/userStore';
export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const {avatar} = useUserStore(state => state.user)

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end mr-2' : 'ml-2'}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full overflow-hidden">
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
        <div className="w-8 h-8 rounded-full  overflow-hidden">
          {/* Placeholder for user avatar */}
          <img src={`${avatar}`} alt="avatar" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}