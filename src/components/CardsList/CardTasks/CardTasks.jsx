import { CircularProgressBar } from "./CircularProgressBar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";
import { DeleteCardConfirm } from "./DeleteCardConfirm";
import { useHandleIcons } from "../../../hooks/useHandleIcons";
import { TasksList } from "./TasksList";
import { useId, useState } from "react";
import { createTask } from "../../../api/task";

export const CardTasks = ({ cardTasks, indexCard }) => {
  const { title, description, tasks, id, isSaving, isDeleting } = cardTasks;
  const { iconState, handleChange } = useHandleIcons();
  const [tasksList, setTasksList] = useState(tasks || []);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [taskError, setTaskError] = useState("");
  const tasksListId = useId();

  // Se muestra al instante con un id temporal y se reemplaza por el del servidor
  const handleNewTask = async () => {
    // La card aún no tiene id del servidor
    if (isSaving) return;
    const temporaryId = `temp-${Date.now()}`;
    const newTask = {
      cardTasksId: id,
      description: "Write a description",
      isCompleted: false,
    };

    setTaskError("");
    setTasksList((prevTasks) => [{ ...newTask, _id: temporaryId, isSaving: true }, ...prevTasks]);

    try {
      const resp = await createTask(newTask);
      setTasksList((prevTasks) =>
        prevTasks.map((task) =>
          task._id === temporaryId ? { ...newTask, _id: resp.data.task._id } : task
        )
      );
    } catch (error) {
      console.error("Error al crear la task:", error);
      setTasksList((prevTasks) => prevTasks.filter((task) => task._id !== temporaryId));
      setTaskError("Could not create the task. Please try again.");
    }
  };

  const handlePercentageSelectedChecks = () => {
    const totalTasks = tasksList.length;
    const completedTasks = tasksList.filter((task) => task.isCompleted).length;

    const percentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return percentage;
  };

  // Oculta pero montada mientras se borra, para conservar sus tareas si hay que restaurarla
  if (isDeleting) return null;

  return (
    <article className="container-card-tasks" aria-busy={Boolean(isSaving)}>
      {/* Card descriptivo de tareas */}
      <div className="card-tasks">
        {/* CircularProgressBar Component */}
        <CircularProgressBar percentage={handlePercentageSelectedChecks()} />
        {/* Card de informacion  */}
        <CardInformation
          title={title}
          description={description}
          indexCard={indexCard}
          isLocked={Boolean(isSaving)}
        />
        {/* Botones de la card */}
        <ButtonsCardTask
          handleChange={handleChange}
          handleNewTask={handleNewTask}
          onRequestDelete={() => !isSaving && setIsConfirmingDelete(true)}
          iconState={iconState}
          tasksListId={tasksListId}
          title={title}
        />
      </div>

      {/* Confirmación antes de borrar la card */}
      {isConfirmingDelete && (
        <DeleteCardConfirm
          title={title}
          totalTasks={tasksList.length}
          indexCard={indexCard}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}

      {taskError && iconState.showIconAngle && (
        <p className="tasks-error" role="alert">{taskError}</p>
      )}

      {/* Lista de tareas */}
      <TasksList
        id={tasksListId}
        iconState={iconState}
        tasks={tasksList}
        setTasksList={setTasksList}
        onTaskError={setTaskError}
      />
    </article>
  );
};
