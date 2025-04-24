import {
  faAnglesDown,
  faAnglesUp,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../styles/buttonscardtask.css";
import { useCardTasksContext } from "../../../context/CardTasksContext";

export const ButtonsCardTask = ({iconState,handleChange,handleNewTask,indexCard}) => {

  const {deleteCardTask} = useCardTasksContext();

  const handleCardTask = async () => {
    if(!iconState.showTrashIcon) {
      await deleteCardTask(indexCard);
    }else{
      await handleNewTask()
    }
  };

  return (
    <div className="col-2 container-buttons-card-tasks d-flex flex-column justify-content-between align-items-center">
      {/* Botón Eliminar */}
      <div className="iconButton ms-1 mb-2">
        <FontAwesomeIcon
          icon={!iconState.showTrashIcon ? faTrash : faPlus}
          className="icon-trash"
          onClick={handleCardTask}
        />
      </div>

      {/* Botón Desplegar */}
      <div className="iconButton ms-3">
        <FontAwesomeIcon
          icon={!iconState.showIconAngle ? faAnglesDown : faAnglesUp}
          className="icon-anglesdown"
          onClick={handleChange}
          style={{height: "30px", width: "30px"}}
        />
      </div>
    </div>
  );
};
