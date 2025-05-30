// src/components/TaskItem.jsx
import React,{ useState } from 'react';

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(task.description);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        saveEdit();
        }
    };

    const saveEdit = () => {
        if (editDescription.trim() === '') {
        // Opcional: no permitir descripción vacía
        setEditDescription(task.description);
        setIsEditing(false);
        return;
        }
        if (editDescription !== task.description) {
        onEdit({ ...task, description: editDescription });
        }
        setIsEditing(false);
    };

 return (
    <div className="flex items-center justify-between border border-gray-300 rounded-md p-3 mb-2 bg-white hover:bg-gray-50 transition">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />

        {isEditing ? (
          <input
            type="text"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
            className="border-b border-gray-400 focus:outline-none focus:border-blue-600"
          />
        ) : (
          <span
            className={task.completed ? 'line-through text-gray-400' : 'text-gray-900'}
            onDoubleClick={() => setIsEditing(true)} 
          >
            {task.description}
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
          aria-label="Editar tarea"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-800 focus:outline-none"
          aria-label="Eliminar tarea"
        >
          🗑
        </button>
      </div>
    </div>
  );
}