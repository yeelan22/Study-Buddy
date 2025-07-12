import express from 'express';
import axios from 'axios';
import Chat from '../models/chat.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'No content' });

  try {
    let chat = await Chat.findOne({ userId: req.userId });
    if (!chat) chat = await Chat.create({ userId: req.userId, messages: [] });

    // add incoming user message
    chat.messages.push({ role: 'user', content });

    // send to LLM
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "mistralai/mistral-7b-instruct",
      messages: chat.messages.slice(-20) // send last N messages
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const assistantMsg = response.data.choices[0].message;

    chat.messages.push(assistantMsg);
    await chat.save();
    res.json(assistantMsg);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat error' });
  }
});

export default router;
