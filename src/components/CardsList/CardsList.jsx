import React from "react";
import "../../styles/cardtasks.css";
import "react-circular-progressbar/dist/styles.css";
import { CardTasks } from "./CardTasks/CardTasks";

export const CardsList = () => {
  return (
    <section className="container container-cardslist justify-content-center align-content-center">
      {/* Card que muestra las tasks */}
      <CardTasks />
      <CardTasks />
      <CardTasks />
      <CardTasks />
      <CardTasks />
      <CardTasks />
      <CardTasks />
    </section>
  );
};
