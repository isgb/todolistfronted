import React, { useState } from 'react'
import { useCardTasksContext } from '../../../context/CardTasksContext';

export const CardInformation = ({ title, description, indexCard }) => {

  const [changeToInput, setChangeToInput] = useState(false)
  const [changeTextArea, setChangeTextArea] = useState(false)
  const { handleChangeCardTaskTitle, handleChangeCardTaskDescription } = useCardTasksContext();

  return (
    <div className="col-7 card-information">

      {
        changeToInput ? (
          <input
            defaultValue={title}
            type="text"
            className="form-control"
            onBlur={(e) => {
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

      {
        changeTextArea ? (
          <textarea
            defaultValue={description}
            className="form-control"
            onBlur={(e) => {
              handleChangeCardTaskDescription(e.target.value, indexCard);
              setChangeTextArea(!changeTextArea);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleChangeCardTaskDescription(e.target.value, indexCard);
                setChangeTextArea(!changeTextArea);
              }
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleChangeCardTaskDescription(e.target.value, indexCard)}
            placeholder="Write a description"
          />
        ) : (
          <p
            onClick={() => setChangeTextArea(!changeTextArea)}
          >
            {description || "Add a description"}
          </p>
        )
      }

    </div>
  )
}
