import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://todolistbackend-eight.vercel.app/api',
});

export default instance;