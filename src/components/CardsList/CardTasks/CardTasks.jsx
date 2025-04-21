import React from "react";
import { CircularProgressBar } from "./CircularProgressbar";
import { CardInformation } from "./CardInformation";
import { ButtonsCardTask } from "./ButtonsCardTask";

export const CardTasks = () => {
  return (
    <div className="row justify-content-between card-tasks">
      {/* CircularProgressBar Component */}
      <CircularProgressBar />

      {/* Card de informacion  */}
      <CardInformation />

      {/* Botones de la card */}
      <ButtonsCardTask/>
    </div>
  );
};
