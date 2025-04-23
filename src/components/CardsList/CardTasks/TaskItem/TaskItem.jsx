import React from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useHandleIcons } from "../../../../hooks/useHandleIcons";

export const TaskItem = ({task}) => {

  const {description, isCompleted} = task;
  const { iconCheck, handleCheckChange } = useHandleIcons(isCompleted);

  return (
    <section className="task row justify-content-between card-task me-3">
      <div className="iconButton col-2 d-flex justify-content-center align-items-center">
        <FontAwesomeIcon
          icon={faCheck}
          onClick={handleCheckChange}
          className={`icon-checkbox ${!iconCheck ? "color-check-principal" :  "color-check-change"}`}
        />
      </div>

      <div className="col-8 description-task">
        <h4 className={iconCheck ? 'text-decoration-line-through' : ''}>
          {description || 'Add an description'}
        </h4>
      </div>

      <div className="iconButton col-2 d-flex justify-content-center align-items-center pe-0">
        <FontAwesomeIcon icon={faTrash} className="icon-trash-task" />
      </div>
    </section>
  );
};
