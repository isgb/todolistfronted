import React from "react";
import "../../styles/cardtasks.css";
import "react-circular-progressbar/dist/styles.css";
import { CardTasks } from "./CardTasks/CardTasks";
import { CardNoTasksAvaible } from "./CardNoTasksAvaible";
import { useTasksContext } from "../../context/TasksContext";

export const CardsList = () => {
  const {tasks} = useTasksContext();

  return (
    <>
      <section className="container container-cardslist justify-content-center align-content-center">
        {
          tasks?.cardsTasks?.length > 0 ? (
            tasks.cardsTasks.map((cardTasks, index) => {
              return <CardTasks key={index} cardTasks={cardTasks} indexCard={index}/>
            })
          ) : (
            <CardNoTasksAvaible />
          )
        }
      </section>
    </>
  );
};
