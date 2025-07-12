import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../store/userStore';
import { useNoteStore } from '../store/noteStore';

export function UploadNotes() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState(null);

  const user = useUserStore((s) => s.user);
  const userId = user?._id;
  console.log("Current User ID:", userId);
  const { notes, setNotes, addNote } = useNoteStore();

  // ⬇️ Load user notes on first render
  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:5001/api/notes/${userId}`)
      .then(res => {setNotes(res.data)
        console.log("Current User ID:", userId);
      })
      .catch(err => console.error("Failed to load notes", err));
  }, [userId]);

  // ⬆️ Handle upload
  const handleUpload = async () => {
    if (!file || !userId) return alert("You must be logged in and select a file.");
    setUploading(true);
    console.log("Current User ID:", userId);

    const formData = new FormData();
    formData.append('note', file);
    formData.append('userId', userId);

    try {
      const res = await axios.post('http://localhost:5001/api/upload', formData);
      setNote(res.data);
      addNote(res.data); // store it
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Your Note</h2>

      {/* Upload Form */}
      <div className="bg-white dark:bg-charcoal p-4 rounded-xl shadow mb-8">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 block"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {note && (
          <div className="mt-6 p-4 bg-gray-100 rounded shadow dark:bg-zinc-800">
            <h3 className="font-semibold">📄 {note.filename}</h3>
            <p className="text-sm text-gray-600">Extracted text:</p>
            <pre className="whitespace-pre-wrap text-sm mt-1">
              {note.extractedText?.slice(0, 500)}...
            </pre>
          </div>
        )}
      </div>

      {/* Previous Notes */}
      <h3 className="text-xl font-semibold mb-2">🗂️ Your Uploaded Notes</h3>
      {notes.length === 0 ? (
        <p className="text-gray-600 text-sm">No notes uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-gray-100 dark:bg-zinc-800 p-4 rounded shadow">
              <h4 className="font-semibold text-base">📄 {note.filename}</h4>
              <p className="text-xs text-gray-500">{new Date(note.uploadedAt).toLocaleString()}</p>
              <pre className="whitespace-pre-wrap text-sm mt-2 text-zinc-700 dark:text-zinc-200">
                {note.extractedText?.slice(0, 300)}...
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
