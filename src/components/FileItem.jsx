// src/components/FileItem.jsx
import React from 'react';

export default function FileItem({ file }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-md p-3 mb-2 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
      <svg
        className="w-5 h-5 text-gray-500 mr-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4h10v12M7 20h10a2 2 0 002-2v-6H5v6a2 2 0 002 2z" />
      </svg>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all"
        title={file.name}
      >
        {file.name}
      </a>
    </div>
  );
}
