import React from 'react'

export const CardInformation = ({ title, description }) => {
  return (
    <div className="col-7 card-information">
      <h4>{title || "Agregar un titulo"}</h4>
      <p>
        {description || "Agregar una descripcion"}
      </p>
    </div>
  )
}
