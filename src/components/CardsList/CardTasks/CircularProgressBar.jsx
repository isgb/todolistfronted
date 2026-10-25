import React from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export const CircularProgressBar = ({percentage}) => {
  return (
    <div className="card-progress">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={9}
        styles={buildStyles({
          textColor: "var(--color-brand-ink)",
          pathColor: "var(--color-brand)",
          trailColor: "var(--color-track)",
          textSize: "24px",
          pathTransitionDuration: 0.25,
        })}
      />
    </div>
  )
}
