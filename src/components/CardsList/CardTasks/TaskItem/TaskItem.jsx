import React, { useState } from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteTaskRequest, updateTaskRequest } from "../../../../api/task";
import { handleActivationKey } from "../../../../helpers/keyboard";

export const TaskItem = ({ task, index, setTasksList, onTaskError }) => {
  const { description, isCompleted, _id, isSaving } = task;
  const [changeToInput, setChangeToInput] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Mientras la tarea se crea o hay una petición en curso se ignoran nuevas acciones
  const isLocked = isSaving || isPending;

  const handleDeleteTask = async () => {
    if (isLocked) return;
    setIsPending(true);
    onTaskError("");
    // Eliminamos la tarea de la lista inmediatamente para una experiencia optimista
    setTasksList((prevTasks) => prevTasks.filter((item) => item._id !== _id));

    try {
      await deleteTaskRequest(_id);
    } catch (error) {
      console.error("Error al eliminar la task:", error);
      setTasksList((prevTasks) => {
        // Si la tarea ya fue eliminada de la lista por otra acción, no la volvemos a agregar
        if (prevTasks.some((item) => item._id === _id)) return prevTasks;
        const restoredTasks = [...prevTasks];
        restoredTasks.splice(index, 0, task);
        return restoredTasks;
      });
      setIsPending(false);
      onTaskError("Could not delete the task. Please try again.");
    }
  };

  const handleChangeTask = async (label, value) => {
    // Mientras la tarea se crea o hay una petición en curso se ignoran nuevas acciones
    if (isLocked) return;
    // El backend exige una descripción, no se guarda vacía ni sin cambios
    if (label === "description" && (!value.trim() || value === description)) return;

    // Guardamos el valor anterior para poder revertirlo en caso de error
    const previousValue = task[label];
    // Actualizamos la tarea en la lista inmediatamente para una experiencia optimista
    const setTaskField = (fieldValue) =>
      setTasksList((prevTasks) =>
        prevTasks.map((item) => (item._id === _id ? { ...item, [label]: fieldValue } : item))
      );

    setIsPending(true);
    onTaskError("");
    setTaskField(value);

    try {
      await updateTaskRequest(_id, { ...task, [label]: value });
    } catch (error) {
      console.error("Error al actualizar la task:", error);
      setTaskField(previousValue);
      onTaskError("Could not update the task. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const startEditing = () => {
    if (!isLocked) setChangeToInput(true);
  };

  const saveDescription = (value) => {
    handleChangeTask("description", value);
    setChangeToInput(false);
  };

  return (
    <li className={`card-task ${isCompleted ? "is-completed" : ""}`} aria-busy={isLocked}>
      <button
        type="button"
        className={`iconButton icon-checkbox ${
          isCompleted ? "color-check-change" : "color-check-principal"
        }`}
        onClick={() => handleChangeTask("isCompleted", !isCompleted)}
        aria-pressed={isCompleted}
        aria-label={`Mark "${description}" as ${isCompleted ? "pending" : "completed"}`}
      >
        <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
      </button>

      <div className="description-task">
        {changeToInput ? (
          <input
            type="text"
            className="form-control"
            defaultValue={description}
            onBlur={(e) => saveDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveDescription(e.target.value);
              if (e.key === "Escape") setChangeToInput(false);
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            placeholder="Add a description"
            aria-label="Task description"
          />
        ) : (
          <h4
            className={`task-text editable-text ${isCompleted ? "text-decoration-line-through" : ""}`}
            tabIndex={0}
            title="Edit task"
            onClick={startEditing}
            onKeyDown={(e) => handleActivationKey(e, startEditing)}
          >
            {description || "Add a description"}
          </h4>
        )}
      </div>

      <button
        type="button"
        className="iconButton icon-trash-task"
        onClick={handleDeleteTask}
        aria-label={`Delete "${description}"`}
      >
        <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
      </button>
    </li>
  );
};
