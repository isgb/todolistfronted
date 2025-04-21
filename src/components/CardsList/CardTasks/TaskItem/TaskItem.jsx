import React from "react";
import "../../../../styles/TaskItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

export const TaskItem = () => {
  return (
    <section className="task row justify-content-between card-task">
      <div className="iconButton col-2">
      <FontAwesomeIcon icon={faSquare} />
      </div>

      <p className="col-10">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </p>
    </section>
  );
};
