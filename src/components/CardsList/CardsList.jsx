import React, { useEffect, useState } from "react";
import "../../styles/cardtasks.css";
import "react-circular-progressbar/dist/styles.css";
import { CardTasks } from "./CardTasks/CardTasks";
import { CardNoTasksAvaible } from "./CardNoTasksAvaible";

export const CardsList = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {

    const handleData = async () => {
      const response = await fetch("/data/cardsTasks.json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setDatos(data);
    }

    handleData();
  }, []);

  return (
    <>
      <section className="container container-cardslist justify-content-center align-content-center">
        {
          datos?.cardsTasks?.length > 0 ? (
            datos.cardsTasks.map((cardTasks, index) => {
              return <CardTasks key={index} cardTasks={cardTasks} />
            })
          ) : (
            <CardNoTasksAvaible />
          )
        }
      </section>
    </>
  );
};
