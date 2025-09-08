
import client, { setToken, clearToken } from "./client";

export async function login(email, password) {
	const { data } = await client.post("/auth/login", { email, password });
	if (data?.token) setToken(data.token);
	if (data?.role) localStorage.setItem("user_role", String(data.role));
	if (data?.userId) localStorage.setItem("userId", String(data.userId));
	return data;
}

export async function signup(payload) {
	const { data } = await client.post("/auth/signup", payload);
	if (data?.token) setToken(data.token);
	if (data?.role) localStorage.setItem("user_role", String(data.role));
	if (data?.userId) localStorage.setItem("userId", String(data.userId));
	return data;
}

export async function logout() {
	clearToken();
	try { localStorage.removeItem("user_role"); } catch {}
	try { localStorage.removeItem("userId"); } catch {}
}

export async function getProfile(userId) {
	const { data } = await client.get(`/profile`, { params: { userId } });
	return data;
}

export async function changePassword(userId, currentPassword, newPassword) {
	return client.post(`/profile/change-password`, { currentPassword, newPassword }, { params: { userId } });
}

export async function resetPassword(email, newPassword) {
	return client.post(`/profile/reset-password`, { email, newPassword });
}

