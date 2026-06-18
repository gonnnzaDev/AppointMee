export const API_URL = "http://localhost:8080";

function getToken() {
    return localStorage.getItem("token");
}

export function authHeaders() {
    const token = getToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
}

export async function sesionActiva() {

    try {

        const response = await fetch(
            API_URL + "/usuarios/me",
            {
                headers: authHeaders()
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch (error) {
        return null;
    }
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "../login-folder/Login.html";
}