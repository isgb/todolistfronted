import {
  faAnglesDown,
  faAnglesUp,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../styles/buttonscardtask.css";

export const ButtonsCardTask = ({ iconState, handleChange, handleNewTask, onRequestDelete, tasksListId, title }) => {
  const isExpanded = iconState.showIconAngle;

  // Con la card cerrada el botón borra la card, abierta agrega una tarea
  const handleCardTask = () => {
    if (!iconState.showTrashIcon) {
      onRequestDelete();
    } else {
      handleNewTask();
    }
  };

  return (
    <div className="card-actions">
      {/* Botón Eliminar / Agregar tarea */}
      <button
        type="button"
        className="iconButton icon-trash"
        onClick={handleCardTask}
        aria-label={iconState.showTrashIcon ? `Add a task to ${title}` : `Delete ${title}`}
      >
        <FontAwesomeIcon icon={iconState.showTrashIcon ? faPlus : faTrash} aria-hidden="true" />
      </button>

      {/* Botón Desplegar */}
      <button
        type="button"
        className="iconButton icon-anglesdown"
        onClick={handleChange}
        aria-expanded={isExpanded}
        aria-controls={tasksListId}
        aria-label={isExpanded ? `Hide tasks of ${title}` : `Show tasks of ${title}`}
      >
        <FontAwesomeIcon icon={isExpanded ? faAnglesUp : faAnglesDown} aria-hidden="true" />
      </button>
    </div>
  );
};
