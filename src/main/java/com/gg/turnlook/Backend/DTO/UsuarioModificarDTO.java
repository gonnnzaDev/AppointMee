package com.gg.turnlook.Backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UsuarioModificarDTO {


    @Size(min = 3, max = 60, message = "El nombre debe estar entre 3 y 60 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo puede contener letras")
    private String nombre;

    @Size(min = 3, max = 60, message = "El apellido debe estar entre 3 y 60 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El apellido solo puede contener letras")
    private String apellido;

    @Size(min = 8, max = 67, message = "La contraseña debe tener como minimo 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%&*!_-]).+$",
            message = "La contraseña debe contener al menos una minuscula, una mayuscula, " +
                    "un numero y un caracter especial (@#$%&*!_-)")
    private String password;

    @Email(message = "El formato del email es invalido")
    @Size(min = 8, max = 150, message = "El email debe estar entre 8 y 150 caracteres")
    private String email;

    /// CONSTRUCTORES
    public UsuarioModificarDTO(String nombre, String apellido, String password, String email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.password = password;
        this.email = email;
    }

    public UsuarioModificarDTO() {
    }

    /// GETTERS AND SETTERS
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
