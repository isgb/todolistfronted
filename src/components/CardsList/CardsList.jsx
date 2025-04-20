import React from "react";
import "../../styles/cardtasks.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const CardsList = () => {
  return (
    <section className="container container-cardslist">
      <div className="row justify-content-between card-tasks">

        <div className="col-2 porcentaje">
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

        <div className="col-8 card-information">
          <h4>Add Your Task List</h4>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            odio explicabo ducimus distinctio quidem, magni non debitis iusto
            itaque nulla labore, a totam iure? Tenetur deserunt in nam
            necessitatibus iure.
          </p>
        </div>

        <div className="col-2 container-buttons-card-tasks">
          <div>BORR</div>
          <div>DESP</div>
        </div>
      </div>
    </section>
  );
};
