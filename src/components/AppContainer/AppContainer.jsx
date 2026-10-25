import React from "react";
import "../../styles/TaskContainer.css";
import { Header } from "../Header/Header";
import { CardsList } from "../CardsList/CardsList";

export const AppContainer = () => {
  return (
    <section className="task-container">
      {/* Header de la app ToDo-List */}
      <Header />

      {/* Lista de cards */}
      <CardsList/>
    </section>
  );
};
