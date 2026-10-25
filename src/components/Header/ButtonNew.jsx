import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCardTasksContext } from "../../context/CardTasksContext";

export const ButtonNew = () => {

  const { newCardTask, isLoading } = useCardTasksContext();

  return (
    <button
      type="button"
      className="button-new"
      onClick={() => newCardTask()}
      // Si se crea durante la carga inicial, la lista recibida reemplaza a la card nueva
      disabled={isLoading}
      aria-label="Create a new task list"
    >
      <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
      New
    </button>
  );
};
