import React from "react";
import "../../styles/cardtasks.css";
import "react-circular-progressbar/dist/styles.css";
import { CardTasks } from "./CardTasks/CardTasks";
import { TaskItem } from "./CardTasks/TaskItem/TaskItem";

export const CardsList = () => {
  return (
    <section className="container container-cardslist justify-content-center align-content-center">
      
      {/* muestra la Card de información con su respectiva lista de tasks */}
        <CardTasks />
        <TaskItem/>

    </section>
  );
};
