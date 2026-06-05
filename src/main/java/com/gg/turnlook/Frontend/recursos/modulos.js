export async function sesionActiva() {

  try {
    const response = await fetch("http://localhost:8080/usuarios/me");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    
    return await response.json();
  } catch (error) {
    alert(error.message);
    return null;
  }

}


export const baseUrl = window.location.origin;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regla q todos los email deben cumplir
