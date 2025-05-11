import axios from "axios";

const instance = axios.create({
    baseURL: 'https://todolistbackend-eight.vercel.app/api',
});

export default instance;