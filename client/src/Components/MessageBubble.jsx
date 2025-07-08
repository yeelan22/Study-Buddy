import { motion } from 'framer-motion';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`max-w-[70%] px-4 py-2 my-2 rounded-lg ${
        isUser
          ? 'ml-auto bg-blue text-white'
          : 'mr-auto bg-zinc-200 dark:bg-zinc-700 dark:text-white'
      }`}
    >
      {message.content}
    </motion.div>
  );
}
