import React from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

export const TaskItem = () => {
  return (
    <section className="task row justify-content-between card-task me-3">
      
      <div className="iconButton col-2 d-flex justify-content-center align-items-center">
        <FontAwesomeIcon 
            icon={faCheck} 
            className="icon-checkbox"
          />
      </div>

      <div className="col-8 description-task">
         <h4>Add Your Task List</h4> 
      </div>

      <div className="iconButton col-2 d-flex justify-content-center align-items-center pe-0">
        <FontAwesomeIcon 
            icon={faTrash}
            className="icon-trash-task"
        />
      </div>
      
    </section>
  );
};
