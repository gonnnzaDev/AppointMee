package com.gg.turnlook.Backend.DTO;

public class UsuarioMostrarDTO {

    final private String nombre;
    final private String apellido;
    final private String email;

    /// CONSTRUCTORES

    public UsuarioMostrarDTO(String nombre, String apellido, String email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
    }

    /// GETTERS
    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getEmail() {
        return email;
    }
}
