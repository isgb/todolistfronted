import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCardTasksContext } from "../../context/CardTasksContext";

export const ButtonNew = () => {

  const { newCardTask } = useCardTasksContext();

  return (
    <button
      type="button"
      className="button-new"
      onClick={() => newCardTask()}
      aria-label="Create a new task list"
    >
      <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
      New
    </button>
  );
};
