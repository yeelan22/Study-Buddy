// File: UploadCard.jsx
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { XIcon } from "@heroicons/react/solid";

export default function UploadCard() {
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Files uploaded:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxSize: 50 * 1024 * 1024 });

  return (
    <div className="w-full max-w-sm mx-auto mt-20 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl text-white relative">
      {/* Close button */}
      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200">
        <XIcon className="w-5 h-5" />
      </button>

      {/* Folder Icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-500 rounded-lg w-16 h-16 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-center mb-2">Upload files</h2>
      <p className="text-gray-400 text-sm text-center mb-4">
        Select and upload the files of your choice
      </p>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-400 bg-gray-700" : "border-gray-600 bg-gray-800"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-400">
          {isDragActive
            ? "Drop the files here..."
            : "Choose a file or drag & drop it here"}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          JPEG, PNG, PDG, and MP4 formats, up to 50MB
        </p>
      </div>

      {/* Browse button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => document.querySelector("input[type=file]").click()}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold transition-colors"
        >
          Browse File
        </button>
      </div>
    </div>
  );
}
