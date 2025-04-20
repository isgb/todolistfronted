import { faAnglesDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../styles/buttonscardtask.css";
import React from "react";

export const ButtonsCardTask = () => {
  return (
    <div className="col-2 container-buttons-card-tasks d-flex flex-column justify-content-between align-items-center">
      <div className="iconButton ms-1 mb-2">
        <FontAwesomeIcon icon={faTrash} className="icon-trash" />
      </div>

      <div className="iconButton ms-3">
        <FontAwesomeIcon
          icon={faAnglesDown}
          className="icon-anglesdown"
          size="2x"
        />
      </div>
    </div>
  );
};
