import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars} from '@fortawesome/free-solid-svg-icons'

export const IconMenu = () => {
  return (
    <div className="col-auto d-flex align-items-center container-menu-and-title">
          {/* <FontAwesomeIcon icon={faBars} size={'2x'} className="iconMenu" /> */}
          <h3 className="mb-0">Task List</h3>
    </div>
  )
}
