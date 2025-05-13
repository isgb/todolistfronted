import React, { useState } from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteTaskRequest, updateTaskRequest } from "../../../../api/task";

export const TaskItem = ({ task, setTasksList, tasks, indexItem }) => {
  const { description, isCompleted, _id } = task;
  const [changeToInput, setChangeToInput] = useState(false);

  const handleDeleteTask = async () => {
    const respDelete = await deleteTaskRequest(_id);
    if (respDelete.status === 200) {
      const tasksModified = tasks.filter((_, index) => index !== indexItem);
      setTasksList(tasksModified);
    }
  };

  const handleChangeTask = async (label, value) => {
    const taskCheck = { ...task, [label]: value };
    const respTaskUpdated = await updateTaskRequest(_id, taskCheck);
    if (respTaskUpdated.status === 200) {
      const tasksModified = tasks.map((task, index) =>
        index === indexItem ? { ...task, [label]: value } : task
      );
      setTasksList(tasksModified);
    }
  };

  return (
    <section className="task row justify-content-between card-task me-3">
      <div className="iconButton col-2 d-flex justify-content-center align-items-center">
        <FontAwesomeIcon
          icon={faCheck}
          onClick={() => handleChangeTask("check", !isCompleted)}
          className={`icon-checkbox ${
            isCompleted ? "color-check-change" : "color-check-principal"
          }`}
        />
      </div>

      <div className="col-8 description-task">
        {changeToInput ? (
          <input
            type="text"
            className="form-control"
            defaultValue={description}
            onBlur={(e) => {
              handleChangeTask("description", e.target.value);
              setChangeToInput(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleChangeTask("description", e.target.value);
                setChangeToInput(false);
              }
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            placeholder="Add a description"
          />
        ) : (
          <h4
            className={isCompleted ? "text-decoration-line-through" : ""}
            onClick={() => setChangeToInput(true)}
          >
            {description || "Add a description"}
          </h4>
        )}
      </div>

      <div className="iconButton col-2 d-flex justify-content-center align-items-center pe-0">
        <FontAwesomeIcon
          icon={faTrash}
          className="icon-trash-task"
          onClick={handleDeleteTask}
        />
      </div>
    </section>
  );
};
