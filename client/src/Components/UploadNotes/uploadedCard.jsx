import { Sparkle, FileStack, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, scrollToTop } from "../shared";

export function UploadedCard({ note }) {
  const navigate = useNavigate();

  const handleViewFlashcards = () => {
    // Navigate to memory zone with the specific note ID
    navigate(`/app/memoryZone?noteId=${note._id}`);
    
    // Scroll to top immediately and after navigation
    scrollToTop();
    
    // Also scroll after navigation completes
    setTimeout(() => {
      scrollToTop();
    }, 200);
  };
  return (
    <div className="uploadedCard_shape card min-w-54 min-h-48 rounded-xl relative p-4 text-white shadow-md">
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
        <Tooltip text="Generate AI summary and insights">
          <button className="inner-card w-8 h-8 flex items-center justify-center transition cursor-pointer">
            <Sparkle size={16} />
          </button>
        </Tooltip>
        <Tooltip text="View flashcards for this note">
          <button 
            className="inner-card w-8 h-8 flex items-center justify-center transition hover:bg-blue-600 cursor-pointer"
            onClick={handleViewFlashcards}
          >
            <FileStack size={16} />
          </button>
        </Tooltip>
        <Tooltip text="Create mind map from this note">
          <button className="inner-card w-8 h-8 flex items-center justify-center transition cursor-pointer">
            <Brain size={16} />       
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
