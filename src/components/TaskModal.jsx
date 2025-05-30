import React, { useState, useEffect, useRef  } from 'react';
import TaskItem from './TaskItem';
import CommentItem from './CommentItem';
import FileItem from './FileItem';

export default function TaskModal({ listId, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/task-lists/${listId.id}`)
      .then(res => res.json())
      .then(data => {
        setTasks(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [listId.id]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/getFiles/${listId.id}`)
        .then(res => res.json())
        .then(data => {
            setAttachments(Array.isArray(data) ? data : []); 
            setLoading(false);
        });
    }, [listId.id]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    fetch(`/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
          task_list_id: listId.id, 
        description: description,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setTasks(prev => [...prev, data]);
        setDescription('');
      });
  };
  const handleToggleComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      });
  };
   const handleEditTask = (updatedTask) => {
    fetch(`http://localhost:8000/api/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks(prev => prev.map(t => t.id === newTask.id ? newTask : t));
      });
  };
  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:8000/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      });
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task_list_id', listId.id);

    fetch('http://localhost:8000/api/attachments', {
        method: 'POST',
        body: formData,
    })
        .then(res => res.json())
        .then(data => {
        setAttachments(prev => [...prev, data]);
        console.log('Archivo subido:', data);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        });
  };
  const handleDeleteFile = (id) => {
  fetch(`http://localhost:8000/api/attachments/${id}`, {
    method: 'DELETE',
  })
    .then(res => {
      if (res.status === 204) {        
        setAttachments(prev => prev.filter(file => file.id !== id));
      } else {
        console.error('Error al borrar el archivo');
      }
    });
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">Tareas</h2>

        {/* Formulario para agregar tarea */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Descripción de la tarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="flex-1 border rounded-lg p-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Agregar
          </button>
        </form>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id}>
                <TaskItem
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
                {task.comments?.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
                {task.files?.map(file => (
                  <FileItem key={file.id} file={file} />
                ))}
              </div>
            ))}
          </div>          
        )}
       <div>
        <form onSubmit={handleFileUpload} className="flex items-center gap-2 mb-4">
            <input
                type="file"
                 ref={fileInputRef}
                onChange={handleFileChange}
                className="border rounded p-2"
            />
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Subir Archivo
            </button>
        </form>
        <h3 className="font-semibold mb-2">Archivos adjuntos</h3>
        {attachments.length === 0 ? (
          <p>No hay archivos.</p>
        ) : (
          <ul>
            {attachments.map(file => (
              <li key={file.id}>
                {/* Puedes mostrar el nombre, link, etc. */}
                <a href={`http://localhost:8000/storage/${file.file_path}`} target="_blank" rel="noopener noreferrer">
                  {file.name}    
                </a>
                <a
                    onClick={() => handleDeleteFile(file.id)}
                    className="focus:outline-none ml-2 cursor-pointer"
                    aria-label="Eliminar archivo"
                >
                    <span className="text-red-600 hover:text-red-800 text-xl font-bold">x</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

        <button
          className="mt-6 text-red-600 hover:underline"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
