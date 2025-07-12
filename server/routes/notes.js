import express from 'express';
import Note from '../models/note.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId }).sort({ uploadedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch notes' });
  }
});

export default router;
