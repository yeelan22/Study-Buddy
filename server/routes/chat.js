import express from 'express';
import axios from 'axios';
import Chat from '../models/chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/history/latest', async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.userId }).sort({ updatedAt: -1 });
    if (!chat) return res.json({ chat: null });
    res.json({ chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch latest chat' });
  }
});

router.post('/', async (req, res) => {
  const { messages, content, chatId } = req.body;

  try {
    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);
    }

    // fallback to find or create latest chat for user
    if (!chat) {
      chat = await Chat.findOne({ userId: req.userId }).sort({ updatedAt: -1 });
      if (!chat) {
        chat = await Chat.create({ userId: req.userId, messages: [] });
      }
    }

    const userMsg = content || messages?.at(-1); // support both styles
    if (!userMsg || !userMsg.content) {
      return res.status(400).json({ error: 'No content provided' });
    }

    chat.messages.push({ role: 'user', content: userMsg.content });

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "mistralai/mistral-7b-instruct",
      messages: chat.messages.slice(-20),
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const assistantMsg = response.data.choices[0].message;
    chat.messages.push(assistantMsg);
    await chat.save();

    res.json({ reply: assistantMsg, chatId: chat._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat error' });
  }
});


export default router;
