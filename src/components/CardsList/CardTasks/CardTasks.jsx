import { CircularProgressBar } from "./CircularProgressbar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";
import { useHandleIcons } from "../../../hooks/useHandleIcons";
import { TasksList } from "./TasksList";
import { useState } from "react";
import { createTask } from "../../../api/task";

export const CardTasks = ({ cardTasks, indexCard }) => {
  const { title, description, tasks,id } = cardTasks;
  const { iconState, handleChange } = useHandleIcons();
  const [tasksList, setTasksList] = useState(tasks || []);

  const handleNewTask = async () => {
    try {
      const newTask = {
        cardTasksId: id,
        description: "Write a description",
        isCompleted: false,
      };

      const resp = await createTask(newTask);
      if (resp.status === 200) {
        setTasksList([
          {
            ...newTask,
            id: resp.data.task._id
          }, 
          ...tasksList]);
      }
    } catch (error) {
      console.log("Error al crear la taks", error)
      throw new Error("Ocurrio un error al crear una nueva task");
    }
  };

  const handlePercentageSelectedChecks = () => {
    const totalTasks = tasksList.length;
    const completedTasks = tasksList.filter((task) => task.isCompleted).length;

    const percentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return percentage;
  };

  return (
    <div className="container-card-tasks">
      {/* Card descriptivo de tareas */}
      <div className="row justify-content-between card-tasks">
        {/* CircularProgressBar Component */}
        <CircularProgressBar percentage={handlePercentageSelectedChecks()} />
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
