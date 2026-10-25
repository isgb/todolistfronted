import { TaskItem } from "./TaskItem/TaskItem";

export const TasksList = ({ id, iconState, tasks, setTasksList, onTaskError }) => {
  if (!iconState.showIconAngle) return null;

  if (tasks.length === 0) {
    return (
      <p id={id} className="tasks-empty">
        No tasks yet. Use the + button to add one.
      </p>
    );
  }

  return (
    <ul id={id} className="tasks-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={task._id}
          task={task}
          index={index}
          setTasksList={setTasksList}
          onTaskError={onTaskError}
        />
      ))}
    </ul>
  );
};
