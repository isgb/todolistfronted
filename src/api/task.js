import axios from "./axios";
import { USE_MOCKS } from "./config";
import {
  mockCreateTask,
  mockDeleteTask,
  mockGetListTasks,
  mockUpdateTask,
} from "../mocks/mockApi";

export const getListTasks = () => {
  if (USE_MOCKS) return mockGetListTasks();
  return axios.get("/tasks/list", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createTask = (data) => {
  if (USE_MOCKS) return mockCreateTask(data);
  return axios.post("/tasks/save", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteTaskRequest = (id) => {
  if (USE_MOCKS) return mockDeleteTask(id);
  return axios.delete(`/tasks/remove/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateTaskRequest = (id, data) => {
  if (USE_MOCKS) return mockUpdateTask(id, data);
  return axios.put(`/tasks/update/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
