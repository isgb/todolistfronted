import React from 'react';
import "../../../styles/TaskConnectors.css";

function TaskConnectors({ nombre }) {
  return (
    <div className="tarea-container">
      <div className="reordenar">
        {/* Icono de reordenar */}
        <span className="flechas">«</span>
      </div>
      <div className="contenido">
        <span>{nombre}</span>
      </div>
      <div className="eliminar">
        {/* Icono de eliminar */}
        <span className="papelera">🗑️</span>
      </div>
    </div>
  );
}

export default TaskConnectors;