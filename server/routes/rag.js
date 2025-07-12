import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { answerWithRAG } from '../utils/queryRAG.js';
import Chat from '../models/chat.js';

const router = express.Router();
router.use(authenticate);

router.post('/', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'No query' });

  try {
    const assistantMsg = await answerWithRAG(req.userId, query);

    let chat = await Chat.findOne({ userId: req.userId });
    if (!chat) chat = await Chat.create({ userId: req.userId, messages: [] });
    chat.messages.push({ role: 'user', content: query });
    chat.messages.push(assistantMsg);
    await chat.save();

    res.json(assistantMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'RAG error' });
  }
});

export default router;
