import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export const CardTasks = () => {
  return (
    <div className="row justify-content-between card-tasks">
      
      <div className="col-3 porcentaje d-flex justify-content-center align-content-center">
        <div className="content-circularprogressbar d-flex align-items-center justify-content-center">
          <CircularProgressbar
            value={75}
            text={`${75}%`}
            styles={buildStyles({
              textColor: "#FFB035",
              pathColor: "#FFB035",
              trailColor: "#eee",
            })}
          />
        </div>
      </div>

      <div className="col-7 card-information">
        <h4>Add Your Task List</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
          odio explicabo ducimus
        </p>
      </div>

      <div className="col-2 container-buttons-card-tasks">
        <div>BORR</div>
        <div>DESP</div>
      </div>

    </div>
  );
};
