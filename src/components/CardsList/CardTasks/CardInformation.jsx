import React, { useState, useEffect } from 'react';
import { useCardTasksContext } from '../../../context/CardTasksContext';
import { handleActivationKey } from '../../../helpers/keyboard';

export const CardInformation = ({ title, description, indexCard, isLocked }) => {
  const [tempTitle, setTempTitle] = useState(title);
  const [tempDescription, setTempDescription] = useState(description);
  const [changeToInput, setChangeToInput] = useState(false);
  const [changeTextArea, setChangeTextArea] = useState(false);
  const { handleChangeCardTaskTitle, handleChangeCardTaskDescription } = useCardTasksContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // El backend exige un título, no se guarda vacío
      if (tempTitle.trim() && tempTitle !== title) {
        handleChangeCardTaskTitle(tempTitle, indexCard);
      }
    }, 500); // Espera 500ms después de que el usuario deja de escribir

    return () => clearTimeout(timeoutId);
  }, [tempTitle, title, indexCard, handleChangeCardTaskTitle]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempDescription.trim() && tempDescription !== description) {
        handleChangeCardTaskDescription(tempDescription, indexCard);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tempDescription, description, indexCard, handleChangeCardTaskDescription]);

  // Mientras la card se crea no tiene id del servidor y no se puede guardar
  const startEditingTitle = () => !isLocked && setChangeToInput(true);
  const startEditingDescription = () => !isLocked && setChangeTextArea(true);

  return (
    <div className="card-information">
      {changeToInput ? (
        <input
          value={tempTitle}
          type="text"
          className="form-control card-title-input"
          onBlur={() => setChangeToInput(false)}
          onKeyDown={(e) => e.key === "Enter" && setChangeToInput(false)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setTempTitle(e.target.value)} // Solo actualiza el estado temporal
          placeholder="Write a title"
          aria-label="List title"
          autoFocus
        />
      ) : (
        <h2
          className="card-title editable-text"
          tabIndex={0}
          title="Edit title"
          onClick={startEditingTitle}
          onKeyDown={(e) => handleActivationKey(e, startEditingTitle)}
        >
          {title || "Add a title"}
        </h2>
      )}

      {changeTextArea ? (
        <textarea
          value={tempDescription}
          className="form-control card-description-input"
          rows={2}
          onBlur={() => setChangeTextArea(false)}
          onKeyDown={(e) => e.key === "Enter" && setChangeTextArea(false)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setTempDescription(e.target.value)} // Solo actualiza el estado temporal
          placeholder="Write a description"
          aria-label="List description"
          autoFocus
        />
      ) : (
        <p
          className="card-description editable-text"
          tabIndex={0}
          title="Edit description"
          onClick={startEditingDescription}
          onKeyDown={(e) => handleActivationKey(e, startEditingDescription)}
        >
          {description || "Add a description"}
        </p>
      )}
    </div>
  );
};
