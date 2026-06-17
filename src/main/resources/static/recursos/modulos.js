function getToken() {
    return localStorage.getItem("token");
}

export function authHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
    };
}

export async function sesionActiva() {

    try {

        const response = await fetch(
            "/usuarios/me",
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
export const baseUrl = window.location.origin;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regla q todos los email deben cumplir

export function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "../login-folder/Login.html";
}