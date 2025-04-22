import {
  faAnglesDown,
  faAnglesUp,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../styles/buttonscardtask.css";
import { useIconContext } from "../../../context/IconContext.jsx";

export const ButtonsCardTask = () => {
  const { iconState, handleChange } = useIconContext();
  return (
    <div className="col-2 container-buttons-card-tasks d-flex flex-column justify-content-between align-items-center">
      <div className="iconButton ms-1 mb-2">
        <FontAwesomeIcon
          icon={!iconState.showTrashIcon ? faTrash : faPlus}
          className="icon-trash"
        />
      </div>

      <div className="iconButton ms-3">
        <FontAwesomeIcon
          icon={!iconState.showIconAngle ? faAnglesDown : faAnglesUp}
          className="icon-anglesdown"
          size="2x"
          onClick={handleChange}
        />
      </div>
    </div>
  );
};
