import React, { useState, useEffect } from 'react';
import { useCardTasksContext } from '../../../context/CardTasksContext';

export const CardInformation = ({ title, description, indexCard }) => {
  const [tempTitle, setTempTitle] = useState(title);
  const [tempDescription, setTempDescription] = useState(description);
  const [changeToInput, setChangeToInput] = useState(false);
  const [changeTextArea, setChangeTextArea] = useState(false);
  const { handleChangeCardTaskTitle, handleChangeCardTaskDescription } = useCardTasksContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempTitle !== title) {
        handleChangeCardTaskTitle(tempTitle, indexCard);
      }
    }, 500); // Espera 500ms después de que el usuario deja de escribir

    return () => clearTimeout(timeoutId);
  }, [tempTitle]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempDescription !== description) {
        handleChangeCardTaskDescription(tempDescription, indexCard);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tempDescription]);

  return (
    <div className="col-7 card-information">
      {changeToInput ? (
        <input
          value={tempTitle}
          type="text"
          className="form-control"
          onBlur={() => setChangeToInput(false)}
          onKeyDown={(e) => e.key === "Enter" && setChangeToInput(false)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setTempTitle(e.target.value)} // Solo actualiza el estado temporal
          placeholder="Write a title"
          autoFocus
        />
      ) : (
        <h4 onClick={() => setChangeToInput(true)}>{title || "Agregar un título"}</h4>
      )}

      {changeTextArea ? (
        <textarea
          value={tempDescription}
          className="form-control"
          onBlur={() => setChangeTextArea(false)}
          onKeyDown={(e) => e.key === "Enter" && setChangeTextArea(false)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setTempDescription(e.target.value)} // Solo actualiza el estado temporal
          placeholder="Write a description"
          autoFocus
        />
      ) : (
        <p onClick={() => setChangeTextArea(true)}>{description || "Add a description"}</p>
      )}
    </div>
  );
};