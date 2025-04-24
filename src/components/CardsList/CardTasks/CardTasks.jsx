import { CircularProgressBar } from "./CircularProgressbar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";
import { useHandleIcons } from "../../../hooks/useHandleIcons";
import { TasksList } from "./TasksList";
import { useState } from "react";

export const CardTasks = ({ cardTasks, indexCard }) => {
  
  const { title, description, tasks } = cardTasks;
  const { iconState, handleChange } = useHandleIcons();
  const [tasksList, setTasksList] = useState(tasks || []);

  const handleNewTask = () => {
    const newTask = {
      description: "Lorem ipsum dolor sit amet consectetur.",
      isCompleted: false,
    };

    setTasksList([newTask, ...tasksList]);
  };

  const handlePercentageSelectedChecks = () => {
    const totalTasks = tasksList.length;
    const completedTasks = tasksList.filter((task) => task.isCompleted).length;

    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      return percentage
  };

  return (
    <div className="container-card-tasks">
      {/* Card descriptivo de tareas */}
      <div className="row justify-content-between card-tasks">
        {/* CircularProgressBar Component */}
        <CircularProgressBar 
          percentage={handlePercentageSelectedChecks()}
        />
        {/* Card de informacion  */}
        <CardInformation 
            title={title} 
            description={description} 
            indexCard={indexCard}
        />
        {/* Botones de la card */}
        <ButtonsCardTask
          handleChange={handleChange}
          handleNewTask={handleNewTask}
          iconState={iconState}
          indexCard={indexCard}
        />
      </div>

      {/* Lista de tareas */}
      <TasksList 
        iconState={iconState} 
        tasks={tasksList} 
        setTasksList={setTasksList}
      />
    </div>
  );
};
