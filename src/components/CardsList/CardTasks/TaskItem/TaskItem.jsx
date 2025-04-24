import React from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

export const TaskItem = ({task, setTasksList, tasks, indexItem}) => {

  const {description, isCompleted} = task;

  const handleChangeIsCompleted = async (check) => {
    const tasksModified = tasks.map((task,index) => {
        return index === indexItem ? {...task, isCompleted : check} : task
    })
    setTasksList(tasksModified)
  }

  return (
    <section className="task row justify-content-between card-task me-3">
      <div className="iconButton col-2 d-flex justify-content-center align-items-center">
        <FontAwesomeIcon
          icon={faCheck}
          onClick={() => handleChangeIsCompleted(!isCompleted)}
          className={`icon-checkbox ${isCompleted ? "color-check-change" : "color-check-principal" }`} 
        />
      </div>

      <div className="col-8 description-task">
        <h4 className={isCompleted ? 'text-decoration-line-through' : ''}>
          {description || 'Add an description'}
        </h4>
      </div>

      <div className="iconButton col-2 d-flex justify-content-center align-items-center pe-0">
        <FontAwesomeIcon icon={faTrash} className="icon-trash-task" />
      </div>
    </section>
  );
};
