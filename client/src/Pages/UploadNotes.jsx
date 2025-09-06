// UploadNotes.jsx
import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ Use axiosInstance containing headers
import { useUserStore } from '../store/userStore';
import { useNoteStore } from '../store/noteStore';
import { UploadCard, UploadedCard } from '../Components/UploadNotes';
import { Tooltip } from '../Components/shared';

export function UploadNotes() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState(null);

  const user = useUserStore((s) => s.user);
  const userId = user?._id;
  const { notes, setNotes, addNote } = useNoteStore();
  const allNotesArray = Object.values(notes).flat();

  console.log(allNotesArray);

  useEffect(() => {
    if (!userId) return;

    axios.get(`/notes/${userId}`)
      .then(res => setNotes(res.data))
      .catch(err => console.error("Failed to load notes", err));
  }, [userId]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file to upload.");

    setUploading(true);

    const formData = new FormData();
    formData.append('note', file);
    // ❌ DO NOT send userId — the token takes care of that.

    try {
      const res = await axios.post('/upload', formData);
      setNote(res.data);
      addNote(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err?.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <Tooltip text="Upload documents to create flashcards, mind maps, and AI summaries">
        <h2 className="heading-2 mb-4">Upload Your Note</h2>
      </Tooltip>

      {/* Upload Form */}
      <div className="mb-8">
        <UploadCard
          onFileSelect={setFile}
          onUpload={handleUpload}
          uploading={uploading}
        />

        {note && (
          <Tooltip text="Preview of the text extracted from your uploaded document">
            <div className="mt-6 p-4 bg-gray-100 rounded shadow dark:bg-zinc-800">
              <h3 className="font-semibold">📄 {note.filename}</h3>
              <p className="text-sm text-gray-600">Extracted text:</p>
              <pre className="whitespace-pre-wrap text-sm mt-1">
                {note.extractedText?.slice(0, 500)}...
              </pre>
            </div>
          </Tooltip>
        )}
      </div>

      {/* Previous Notes */}
      <Tooltip text="Your previously uploaded notes - click the icons to create flashcards, mind maps, or AI summaries">
        <h3 className="heading-2 mb-4">Uploaded Notes</h3>
      </Tooltip>
      {allNotesArray.length === 0 ? (
        <Tooltip text="Upload your first document to get started with AI-powered study tools">
          <p className="text-gray-600 text-sm text-center">No notes uploaded yet.</p>
        </Tooltip>
      ) : (
        <div className="grid grid-cols-1 sml:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {allNotesArray.map((note) => (
          <UploadedCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}