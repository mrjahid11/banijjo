
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../api/client";

export default function ProtectedRoute({ children }) {
	const token = getToken();
	if (!token) return <Navigate to="/signin" replace />;
	return children;
}

