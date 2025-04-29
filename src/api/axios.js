import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3970/api/cardtasks',
});

export default instance;