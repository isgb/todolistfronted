import { useId } from "react";
import { TaskItem } from "./TaskItem/TaskItem";

export const TasksList = ({ iconState, tasks, setTasksList }) => {
  const id = useId();

  return (
    <>
      {iconState.showIconAngle &&
        tasks.length > 0 &&
        tasks.map((task, index) => (
          <TaskItem key={`${id}-${index}`} task={task} setTasksList={setTasksList} tasks={tasks} indexItem={index} />
        ))}
    </>
  );
};
