// src/components/TaskListCard.jsx
import React from 'react';

export default function TaskListCard({ taskList, onEdit, onDelete, onOpen }) {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-5 cursor-pointer hover:shadow-lg transition relative"
      onClick={() => onOpen(taskList)}
    >
      <h3 className="text-xl font-semibold mb-3 text-center">{taskList.name}</h3>

      <div className="absolute top-3 right-3 flex space-x-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onEdit(taskList)}
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
          aria-label="Editar lista"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(taskList.id)}
          className="text-red-600 hover:text-red-800 focus:outline-none"
          aria-label="Eliminar lista"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
