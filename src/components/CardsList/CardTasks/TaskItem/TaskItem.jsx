import React, { useState } from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { updateLocalStorageWithTask } from "../../../../helpers/ListCardTasks";

export const TaskItem = ({ task, setTasksList, tasks, indexItem, cardTasksId }) => {
  const { description, isCompleted, _id } = task;
  const [changeToInput, setChangeToInput] = useState(false);

  const handleChangeIsCompleted = async (check) => {
    
      const tasksModified = tasks.map((task, index) => {
        return index === indexItem ? { ...task, isCompleted: check } : task;
      });
      setTasksList(tasksModified);

      await updateLocalStorageWithTask(cardTasksId,(tasks) =>
        tasks.map((task, index) => {
          return index === indexItem ? { ...task, isCompleted: check } : task;
        })
      );
    
  };

  const removeTaskByIndex = (indexToRemove) => (tasks) => {
    return tasks.filter((_, index) => index !== indexToRemove);
  };

  const handleDeleteTask = async () => {
    
      const tasksModified = await removeTaskByIndex(indexItem);
      setTasksList(tasksModified);
    
      await updateLocalStorageWithTask(cardTasksId,await removeTaskByIndex(indexItem));
  };

  const updateTaskDescriptionByIndex = (indexToUpdate, newDescription) => (tasks) => {
    return tasks.map((task, index) => 
      index === indexToUpdate 
        ? { ...task, description: newDescription } 
        : task
    );
  };

  const handleChangeDescription = async (description) => {

    const tasksModified = await updateTaskDescriptionByIndex(indexItem, description);
    setTasksList(tasksModified);

    await updateLocalStorageWithTask(cardTasksId, await updateTaskDescriptionByIndex(indexItem, description));

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
