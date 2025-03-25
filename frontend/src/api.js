import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const apiUrl = "https://50104339-2cd2-47ce-8e78-89e2c41737b1-dev.e1-eu-north-azure.choreoapis.dev/django-react-notes/backend-gl/v1"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api