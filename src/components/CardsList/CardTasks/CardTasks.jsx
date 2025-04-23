import { CircularProgressBar } from "./CircularProgressbar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";
import { TaskItem } from "./TaskItem/TaskItem";
import { useHandleIcons } from "../../../hooks/useHandleIcons";
import { TasksList } from "./TasksList";

export const CardTasks = ({cardTasks}) => {
  
  const {title,description, tasks} = cardTasks;

  const { iconState, handleChange } = useHandleIcons();

  return (
    <div className="container-card-tasks">
      {/* Card descriptivo de tareas */}
      <div className="row justify-content-between card-tasks">
        {/* CircularProgressBar Component */}
        <CircularProgressBar />
        {/* Card de informacion  */}
        <CardInformation
          title={title}
          description={description}
        />
        {/* Botones de la card */}
        <ButtonsCardTask 
          handleChange={handleChange} 
          iconState={iconState} 
        />
      </div>

      {/* Lista de tareas */}
      <TasksList
        iconState={iconState}
        tasks={tasks}
      />

    </div>
  );
};
