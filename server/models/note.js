import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  filename: String,
  filetype: String,
  filepath: String,
  extractedText: String,
  hash: { type: String, unique: true },
  userId: { type: String, required: true }, // ✅ Added
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Note', noteSchema);