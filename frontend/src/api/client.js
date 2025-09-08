
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export const getToken = () => localStorage.getItem("auth_token");
export const setToken = (t) => localStorage.setItem("auth_token", t);
export const clearToken = () => localStorage.removeItem("auth_token");

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use((config) => {
	const token = getToken();
	const isAuthRoute = config.url?.startsWith("/auth");
	if (token && !isAuthRoute) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default client;

