// src/pages/TaskList.jsx
import React, { useEffect, useState } from 'react';
import TaskListCard from '../components/TaskListCard';
import TaskModal from '../components/TaskModal';

export default function TaskList() {
  const [taskLists, setTaskLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchTaskLists();
  }, []);

  function fetchTaskLists() {
    fetch('http://localhost:8000/api/task-lists')
      .then((res) => res.json())
      .then((data) => {
        setTaskLists(data);
        setLoading(false);
      });
  }

  function createOrUpdateList() {
    if (newListName.trim() === '') return;

    const method = editingList ? 'PUT' : 'POST';
    const url = editingList
      ? `http://localhost:8000/api/task-lists/${editingList.id}`
      : 'http://localhost:8000/api/task-lists';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newListName }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchTaskLists();
        setNewListName('');
        setEditingList(null);
      });
  }

  function deleteList(id) {
    if (!confirm('¿Seguro que quieres eliminar esta lista?')) return;
    fetch(`http://localhost:8000/api/task-lists/${id}`, {
      method: 'DELETE',
    }).then(() => {
      fetchTaskLists();
      if (modalOpen && selectedList?.id === id) {
        closeModal();
      }
    });
  }

  function startEditingList(list) {
    setEditingList(list);
    setNewListName(list.name);
  }

  function openModal(list) {
    setSelectedList(list);
    setModalOpen(true);
    fetchTasks(list.id);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedList(null);
    setTasks([]);
    setComments([]);
    setFiles([]);
  }

  function fetchTasks(taskListId) {
    fetch(`http://localhost:8000/api/task-lists/${taskListId}/`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
        setComments(data.comments);
        setFiles(data.files);
      });
  }



  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 w-full">
      <div className="w-full px-6 py-6">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
          Mis Listas de Tareas
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createOrUpdateList();
          }}
          className="mb-8 flex space-x-3 justify-center"
        >
          <input
            type="text"
            placeholder="Nombre de nueva lista"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-3 w-64 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            {editingList ? 'Actualizar' : 'Crear'}
          </button>
          {editingList && (
            <button
              type="button"
              onClick={() => {
                setEditingList(null);
                setNewListName('');
              }}
              className="text-gray-600 px-4 py-3 hover:text-gray-900 transition"
            >
              Cancelar
            </button>
          )}
        </form>

        {loading ? (
          <p className="text-center text-gray-600">Cargando listas...</p>
        ) : taskLists.length === 0 ? (
          <p className="text-center text-gray-600">No tienes listas aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {taskLists.map((list) => (
              <TaskListCard
                key={list.id}
                taskList={list}
                onEdit={startEditingList}
                onDelete={deleteList}
                onOpen={openModal}
              />
            ))}
          </div>
        )}

        {modalOpen && selectedList && (
          <TaskModal
            isOpen={modalOpen}
            onClose={closeModal}
            listId={selectedList}
            tasks={tasks}
            comments={comments}
            files={files}
            // Pasa aquí las funciones para tareas, comentarios y archivos
          />
        )}
      </div>
    </div>
  );
}
