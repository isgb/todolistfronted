import { CircularProgressBar } from "./CircularProgressbar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";
import { useHandleIcons } from "../../../hooks/useHandleIcons";
import { TasksList } from "./TasksList";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  updateLocalStorageWithTask,
} from "../../../helpers/ListCardTasks";

export const CardTasks = ({ cardTasks, indexCard }) => {
  const { title, description, tasks, id } = cardTasks;
  const { iconState, handleChange } = useHandleIcons();
  const [tasksList, setTasksList] = useState(tasks || []);

  // Método para manejar la creación de una nueva tarea y actualizar el localStorage
  const handleNewTask = async () => {
    try {
      const newTask = {
        cardTasksId: id,
        description: "Write a description",
        isCompleted: false,
      };

      // Crear una nueva tarea con un id único
      const newTaskWithId = { ...newTask, id: uuidv4() };

      // Actualizar la lista de tareas en el estado
      setTasksList([newTaskWithId, ...tasksList]);

      // Actualizar lista en localstorage
      await updateLocalStorageWithTask(id, (tasksList) => [newTaskWithId, ...tasksList])

    } catch (error) {
      console.log("Error al crear la task", error);
      throw new Error("Ocurrió un error al crear una nueva task");
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
        cardTasksId={id}
      />
    </div>
  );
};
