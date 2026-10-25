import { useCardTasksContext } from "../../../context/CardTasksContext";

export const DeleteCardConfirm = ({ title, totalTasks, indexCard, onCancel }) => {
  const { deleteCardTask } = useCardTasksContext();
  const getTasksText = () => {
    if (totalTasks === 0) return "";
    return totalTasks === 1 ? " and its task" : ` and its ${totalTasks} tasks`;
  };

  return (
    <div className="card-delete-confirm" role="alertdialog" aria-label={`Delete ${title}`}>
      <p className="card-delete-confirm-text">
        Delete <strong>{title}</strong>{getTasksText()}?
      </p>
      <div className="card-delete-confirm-actions">
        <button type="button" className="button-secondary" onClick={onCancel} autoFocus>
          Cancel
        </button>
        <button type="button" className="button-danger" onClick={() => deleteCardTask(indexCard)}>
          Delete list
        </button>
      </div>
    </div>
  );
};
