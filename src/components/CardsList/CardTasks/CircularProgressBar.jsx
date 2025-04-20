import React from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export const CircularProgressBar = () => {
  return (
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
  )
}
