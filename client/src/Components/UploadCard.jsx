import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X as XIcon } from "lucide-react";
import folder from "../assets/folder.png";

export function UploadCard({ onFileSelect, onUpload, uploading, onClose }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    maxSize: 50 * 1024 * 1024,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4']
    }
  });

  return (
    <div className="w-full mx-auto mt-4 p-6 card rounded-xl shadow-xl text-white relative">
      {/* Close button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}

      {/* Folder Icon */}
      <div className="flex flex-col md:flex-row justify-center md:justify-start items-center mb-4  mx-auto">         
         <img className="md:-ml-8 w-36 h-36" src={folder} alt="folder-icon" />
          {/* Title */}
          <div>
          <h2 className="md:text-start text-center text-xl font-semibold mb-2">Upload files</h2>
        <p className="text-gray-400 text-sm text-center md:text-start mb-4">
          Select and upload the files of your choice
        </p>
          </div>
        
      </div>

     

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue dark:bg-gray-700" : "border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-400">
          {isDragActive
            ? "Drop the files here..."
            : "Choose a file or drag & drop it here"}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          PDF, Docx, JPG, PNG, up to 50MB
        </p>
      </div>

      {/* Upload button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={onUpload}
          disabled={uploading}
          className="bg-blue hover:bg-blue-600 disabled:bg-gray-500 text-white disabled:cursor-not-allowed px-4 py-2 rounded-md font-semibold transition-colors cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
}
