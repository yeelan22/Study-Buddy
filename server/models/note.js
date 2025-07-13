import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  filename: String,
  filetype: String,
  filepath: String,
  extractedText: String,
  hash: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ FIXED: Unique per file **per user**
noteSchema.index({ hash: 1, userId: 1 }, { unique: true });

export default mongoose.model('Note', noteSchema);