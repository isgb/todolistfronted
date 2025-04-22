import React from "react";
import { CircularProgressBar } from "./CircularProgressbar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";
import { TaskItem } from "./TaskItem/TaskItem";
import { useIconContext } from "../../../context/IconContext";

export const CardTasks = () => {
  
   const { iconState } = useIconContext();

   console.log(iconState)

  return (
    <div className="container-card-tasks">
      {/* Card descriptivo de tareas */}
      <div className="row justify-content-between card-tasks">
        {/* CircularProgressBar Component */}
        <CircularProgressBar />
        {/* Card de informacion  */}
        <CardInformation />
        {/* Botones de la card */}
        <ButtonsCardTask />
      </div>

      {/* Lista de tareas */}
      {
        iconState.showIconAngle &&
          <TaskItem />
      }
    </div>
  );
};
