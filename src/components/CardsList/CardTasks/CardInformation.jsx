import React, { useState } from 'react'
import { useCardTasksContext } from '../../../context/CardTasksContext';

export const CardInformation = ({ title, description, indexCard }) => {

  const [changeToInput, setChangeToInput] = useState(false)
   const {handleChangeCardTaskTitle} = useCardTasksContext();

  return (
    <div className="col-7 card-information">

      {
        changeToInput ? (
          <input
            defaultValue={title}
            type="text"
            className="form-control"
            onBlur={(e) =>{
              handleChangeCardTaskTitle(e.target.value, indexCard)
              setChangeToInput(!changeToInput)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleChangeCardTaskTitle(e.target.value, indexCard)
                setChangeToInput(!changeToInput)
              }
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleChangeCardTaskTitle(e.target.value, indexCard)}
            placeholder="Write a title"
          />
        ) :
        (
          <h4
            onClick={() => setChangeToInput(!changeToInput)}
          >
            {title || "Agregar un titulo"}
          </h4>
        )
      }

      <p>
        {description || "Agregar una descripcion"}
      </p>
    </div>
  )
}
