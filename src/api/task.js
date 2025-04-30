import axios from "./axios";

export const getListTasks = () => {
  return axios.get("/tasks/list", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createTask = (data) => {
  return axios.post("/tasks/save", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteTaskRequest = (id) => {
  return axios.delete(`/tasks/remove/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateTaskRequest = (id, data) => {
  return axios.put(`/tasks/update/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
