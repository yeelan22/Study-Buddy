// routes/upload.js
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

import { processNoteForRAG } from '../utils/EmbedAndStore.js';
import upload from '../middleware/upload.js';
import { extractTextFromPDF, extractTextFromDocx, extractTextFromImage } from '../utils/analyzeFile.js';
import Note from '../models/note.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/upload
 * Auth-protected route to receive file uploads
 */
router.post('/', authenticate, upload.single('note'), async (req, res) => {
  try {
    const file = req.file;
    const userId = req.userId; // ✅ From token, NOT the body — much safer
    if (!file || !userId) return res.status(400).json({ error: 'No file or user ID' });

    const buffer = await fs.readFile(file.path);
    const hash = crypto.createHash('md5').update(buffer).digest('hex');

    const existing = await Note.findOne({ hash, userId });
    if (existing) {
      return res.status(409).json({
        error: 'Duplicate file detected',
        filename: existing.filename,
        extractedText: existing.extractedText,
      });
    }

    const mimetype = file.mimetype;
    let extractedText = '';

    if (mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(file.path);
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDocx(file.path);
    } else if (mimetype.startsWith('image/')) {
      extractedText = await extractTextFromImage(file.path);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    const note = await Note.create({
      filename: file.originalname,
      filetype: mimetype,
      filepath: file.path,
      extractedText,
      hash,
      userId, // ✅ Save to DB
    });

    await processNoteForRAG(extractedText, note._id.toString(), userId);

    res.json(note);
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

export default router;