import { MessageSquare, Copy, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UploadedCard({ note }) {
  const navigate = useNavigate();

  const handleViewFlashcards = () => {
    // Navigate to memory zone with the specific note ID
    navigate(`/app/memoryZone?noteId=${note._id}`);
  };
  return (
    <div className="uploadedCard_shape card min-w-64 min-h-48 rounded-xl relative p-4 text-white shadow-md">
      {/* Text content */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">
            {note.category || "Uncategorized"}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(note.uploadedAt).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm opacity-80">
          {note.title || note.filename || "Untitled"}
        </p>
      </div>

      {/* Action icons */}
      <div className="absolute bottom-3 right-3 flex space-x-2">
        <button className="inner-card w-8 h-8 flex items-center justify-center transition">
          <MessageSquare size={16} />
        </button>
        <button 
          className="inner-card w-8 h-8 flex items-center justify-center transition hover:bg-blue-600"
          onClick={handleViewFlashcards}
          title="View Flashcards"
        >
          <Copy size={16} />
        </button>
        <button className="inner-card w-8 h-8 flex items-center justify-center transition">
          <Brain size={16} />       
        </button>
      </div>
    </div>
  );
}
