import { motion } from 'framer-motion';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        my-2 px-4 py-3 rounded-xl max-w-[70%] 
        ${isUser ? 'ml-auto bg-blue text-white' 
                 : 'mr-auto bg-white/30 text-zinc-800 dark:bg-white/10 dark:text-white'}
        backdrop-blur-lg shadow-md shadow-zinc-200/40 dark:shadow-zinc-800/50
      `}
    >
      {message.content}
    </motion.div>
  );
}