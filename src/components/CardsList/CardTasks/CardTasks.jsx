import React, { useCallback, useState } from "react";
import { CircularProgressBar } from "./CircularProgressbar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";
import { TaskItem } from "./TaskItem/TaskItem";

export const CardTasks = () => {
  
     const [iconState, setIconState] = useState({
       showTrashIcon: false,
       showIconAngle: false,
     });
   
     const handleChange = useCallback(() => {
       setIconState((prev) => ({
         showIconAngle: !prev.showIconAngle,
         showTrashIcon: !prev.showTrashIcon,
       }));
     }, []);

  return (
    <div className="container-card-tasks">
      {/* Card descriptivo de tareas */}
      <div className="row justify-content-between card-tasks">
        {/* CircularProgressBar Component */}
        <CircularProgressBar />
        {/* Card de informacion  */}
        <CardInformation />
        {/* Botones de la card */}
        <ButtonsCardTask 
         handleChange={handleChange}
         iconState={iconState}
        />
      </div>

      {/* Lista de tareas */}
      {
        iconState.showIconAngle &&
          <TaskItem />
      }
    </div>
  );
};
