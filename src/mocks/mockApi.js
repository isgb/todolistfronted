import { initialCardsTasks } from "./mockData";

// API simulada en memoria. Imita las respuestas del backend ({ status, data }).
// Para probar el estado de error agregar ?mockError=1 a la URL.

let cardsTasks = structuredClone(initialCardsTasks);
let nextId = 100;

const MOCK_DELAY_MS = 300;

const createId = (prefix) => {
  nextId += 1;
  return `${prefix}-${nextId}`;
};

const shouldFail = () =>
  new URLSearchParams(window.location.search).get("mockError") === "1";

const respond = (data) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new Error("Mock API error"));
        return;
      }
      resolve({ status: 200, data });
    }, MOCK_DELAY_MS);
  });

const findCardWithTask = (taskId) =>
  cardsTasks.find((card) => card.tasks.some((task) => task._id === taskId));

// ---- Card tasks ----
export const mockGetListCardTasks = () =>
  respond({ status: 200, cardsTasks: structuredClone(cardsTasks) });

export const mockCreateCardTask = (cardData) => {
  const cardId = createId("card");
  cardsTasks = [{ ...cardData, id: cardId, tasks: [] }, ...cardsTasks];
  return respond({ status: "success", cardtasks: { ...cardData, _id: cardId } });
};

export const mockDeleteCardTask = (cardId) => {
  cardsTasks = cardsTasks.filter((card) => card.id !== cardId);
  return respond({ status: "success" });
};

export const mockUpdateCardTask = (cardId, cardData) => {
  cardsTasks = cardsTasks.map((card) =>
    card.id === cardId ? { ...card, ...cardData } : card
  );
  return respond({ status: "success", cardTasks: { _id: cardId, ...cardData } });
};

// ---- Tasks ----
export const mockGetListTasks = () =>
  respond({ status: "success", tasks: cardsTasks.flatMap((card) => card.tasks) });

export const mockCreateTask = (taskData) => {
  const newTask = { ...taskData, _id: createId("task") };
  cardsTasks = cardsTasks.map((card) =>
    card.id === taskData.cardTasksId
      ? { ...card, tasks: [newTask, ...card.tasks] }
      : card
  );
  return respond({ status: "success", task: newTask });
};

export const mockDeleteTask = (taskId) => {
  const card = findCardWithTask(taskId);
  if (card) {
    card.tasks = card.tasks.filter((task) => task._id !== taskId);
  }
  return respond({ status: "success" });
};

export const mockUpdateTask = (taskId, taskData) => {
  const card = findCardWithTask(taskId);
  if (card) {
    card.tasks = card.tasks.map((task) =>
      task._id === taskId ? { ...task, ...taskData } : task
    );
  }
  return respond({ status: "success", task: { ...taskData, _id: taskId } });
};
