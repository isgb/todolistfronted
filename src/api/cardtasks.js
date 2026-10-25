import axios from "./axios";
import { USE_MOCKS } from "./config";
import {
  mockCreateCardTask,
  mockDeleteCardTask,
  mockGetListCardTasks,
  mockUpdateCardTask,
} from "../mocks/mockApi";

export const getListCardTasks = () => {
  if (USE_MOCKS) return mockGetListCardTasks();
  return axios.get("/cardtasks/list", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createCardTask = (data) => {
  if (USE_MOCKS) return mockCreateCardTask(data);
  return axios.post("/cardtasks/save", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteCardTaskRequest = (id) => {
  if (USE_MOCKS) return mockDeleteCardTask(id);
  return axios.delete(`/cardtasks/remove/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateCardTask = async (id, data) => {
  try {
    if (USE_MOCKS) return (await mockUpdateCardTask(id, data)).data;
    const response = await axios.put(`/cardtasks/update/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la tarjeta de tarea:", error);
    throw error;
  }
};

