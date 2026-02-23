import axios from "axios";
import { BACKEND_URL } from "./config";

export const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically refresh the access token on 401 and retry the original request.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt one retry — avoid infinite loops
        if (error.response?.status === 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;

            try {
                // Ask our Next.js API route to refresh the token (it reads the
                // httpOnly refresh_token cookie that JS cannot access directly)
                const { data } = await axios.post("/api/auth/refresh");

                if (data?.token) {
                    // Update the Authorization header for the retried request
                    originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
                    return api(originalRequest);
                }
            } catch {
                // Refresh failed (expired or missing refresh token) — send to login
                if (typeof window !== "undefined") {
                    window.location.href = "/signin";
                }
            }
        }

        return Promise.reject(error);
    }
);
