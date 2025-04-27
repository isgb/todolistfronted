import React from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export const CircularProgressBar = ({percentage}) => {
  return (
    <div className="col-3 porcentaje d-flex justify-content-center align-content-center">
        <div className="content-circularprogressbar d-flex align-items-center justify-content-center">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
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
