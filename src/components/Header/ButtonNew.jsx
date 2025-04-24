import React from "react";
import { useCardTasksContext } from "../../context/CardTasksContext";

export const ButtonNew = () => {

  const { newCardTask } = useCardTasksContext();

  return (
    <div className="col-auto container-button">
      <button
        className="btn btn-outline-light fw-bold py-2 rounded-4 no-active"
        onClick={() => newCardTask()}
      >
        + New
      </button>
    </div>
  );
};
