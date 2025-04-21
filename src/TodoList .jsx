import React, { useState } from 'react';
import './TodoList.css'; // Importa el archivo de estilos

function TodoItem({ id, name, completed, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      <button className="checkbox" onClick={() => onToggle(id)}>
        {completed && '✓'}
      </button>
      <span className="task-name">{name}</span>
      <button className="delete-button" onClick={() => onDelete(id)}>
        🗑️
      </button>
    </div>
  );
}

function TodoList() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Your Completed Task Name', completed: true },
    { id: 2, name: 'Your Completed Task Name', completed: true },
    { id: 3, name: 'Add Your Task Name', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), name: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const calculateProgress = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    return tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  };

  return (
    <div className="todo-list-container">
      <div className="header">
        <div className="progress">
          <div className="progress-circle">
            <div className="progress-value">{calculateProgress()}%</div>
          </div>
        </div>
        <div className="title-description">
          <h3>Add Your Task List</h3>
          <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy euismod tincidunt laoreet dolore magna.</p>
        </div>
        <div className="actions">
          <button className="add-button">+</button>
          <button className="reorder-button">«»</button>
        </div>
      </div>
      <div className="task-items">
        {tasks.map((task, index) => (
          <div key={task.id} className="task-row">
            <TodoItem
              id={task.id}
              name={task.name}
              completed={task.completed}
              onToggle={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
            {index < tasks.length - 1 && <div className="connector-line"></div>}
          </div>
        ))}
        <div className="add-new-task">
          <input
            type="text"
            placeholder="Add new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>+</button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;