
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../api/client";

// Optional role-based guard: pass roles={["admin","broker"]}
export default function ProtectedRoute({ children, roles }) {
	const token = getToken();
	const location = useLocation();
	if (!token) return <Navigate to="/signin" replace state={{ from: location }} />;

	if (roles && roles.length) {
		const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
		const allowed = role && roles.map(r => String(r).toLowerCase()).includes(String(role).toLowerCase());
		if (!allowed) return <Navigate to="/dashboard" replace state={{ denied: true, from: location }} />;
	}

	return children;
}

