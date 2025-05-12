import React, { useState } from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteTaskRequest, updateTaskRequest } from "../../../../api/task";

export const TaskItem = ({ task, setTasksList, tasks, indexItem }) => {
  const { description, isCompleted, _id } = task;
  const [changeToInput, setChangeToInput] = useState(false);

  const handleChangeIsCompleted = async (check) => {

    const taskCheck = {...task, isCompleted : check }
    const respTaskUpdated = await updateTaskRequest(_id, taskCheck)
    if(respTaskUpdated.status === 200){
    const tasksModified = tasks.map((task, index) => {
      return index === indexItem ? { ...task, isCompleted: check } : task;
    });
    setTasksList(tasksModified);
  }
  };

  const handleDeleteTask = async () => {
    const respDelete = await deleteTaskRequest(_id);
    if (respDelete.status === 200) {
      const tasksModified = tasks.filter((task, index) => {
        return index !== indexItem;
      });
      setTasksList(tasksModified);
    }
  };

  const handleChangeDescription = async (description) => {
    console.log("id",task)
    const tasksModified = tasks.map((task, index) => {
      return index === indexItem ? { ...task, description: description } : task;
    });
    setTasksList(tasksModified);
    const taskUpdated = { ...task, description: description }
    await updateTaskRequest(_id, taskUpdated)
  };

  return (
    <section className="task row justify-content-between card-task me-3">
      <div className="iconButton col-2 d-flex justify-content-center align-items-center">
        <FontAwesomeIcon
          icon={faCheck}
          onClick={() => handleChangeIsCompleted(!isCompleted)}
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
              handleChangeDescription(e.target.value);
              setChangeToInput(!changeToInput);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleChangeDescription(e.target.value);
                setChangeToInput(!changeToInput);
              }
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleChangeDescription(e.target.value)}
            placeholder="Add a description"
          />
        ) : (
          <h4
            className={isCompleted ? "text-decoration-line-through" : ""}
            onClick={() => setChangeToInput(!changeToInput)}
          >
            {description || "Add an description"}
          </h4>
        )}
      </div>

      <div className="iconButton col-2 d-flex justify-content-center align-items-center pe-0">
        <FontAwesomeIcon
          icon={faTrash}
          className="icon-trash-task"
          onClick={() => handleDeleteTask()}
        />
      </div>
    </section>
  );
};
