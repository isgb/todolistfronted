import React, { useEffect, useState } from "react";
import "../../styles/cardtasks.css";
import "react-circular-progressbar/dist/styles.css";
import { CardTasks } from "./CardTasks/CardTasks";

export const CardsList = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch("/data/cardsTasks.json")
      .then((response) => response.json())
      .then((data) => setDatos(data))
      .catch((error) => console.error("Error al cargar los datos:", error));
  }, []);

  // console.log(datos ? datos.cardsTasks[0].title : [])
  console.log(datos?.cardsTasks?.[0]?.title );

  return (
    <>
      <section className="container container-cardslist justify-content-center align-content-center">
        {/* {
          datos[0].cardsTasks.map((cardTasks) => {
            return <p>{cardTasks.title}</p>
          })
        } */}
      </section>
    </>
  );
};
