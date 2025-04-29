import axios from "./axios";

export const getListCardTasks = () => {
    return axios.get("/list", {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export const createCardTask = (data) => {
    console.log("data", data);
    return axios.post("/save", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export const deleteCardTaskRequest = (id) => {
    return axios.delete(`/remove/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
}