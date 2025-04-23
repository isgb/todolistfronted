import React from "react";
import { useTasksContext } from "../../context/TasksContext";

export const ButtonNew = () => {
    const {newCardTask} = useTasksContext();

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
