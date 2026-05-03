package com.gg.turnlook.DTO;

import jakarta.validation.constraints.*;

public class UsuarioCrearDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 60, message = "El nombre debe estar entre 3 y 60 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo puede contener letras")
    //                   lo q permite q haya
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 3, max = 60, message = "El apellido debe estar entre 2 y 60 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El apellido solo puede contener letras")
    private String apellido;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 67, message = "La contraseña debe tener como minimo 8 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%&*!_-]).+$",
            message = "La contraseña debe contener al menos una minuscula, una mayuscula, " +
                    "un numero y un caracter especial (@#$%&*!_-)")
    private String password;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email es invalido")
    @Size(min = 8, max = 150, message = "El email debe estar entre 8 y 150 caracteres")
    private String email;


    /// CONSTRUCTORES
    public UsuarioCrearDTO(String nombre, String apellido, String password, String email) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.password = password;
        this.email = email;
    }

    public UsuarioCrearDTO() {
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
