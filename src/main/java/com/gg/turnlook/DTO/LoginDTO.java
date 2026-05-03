package com.gg.turnlook.DTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;


public class LoginDTO {

    /// ATRIBUTOS

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email es invalido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String pass;

    /// CONSTRUCTORES
    public LoginDTO(String email, String pass) {
        this.email = email;
        this.pass = pass;
    }

    public LoginDTO() {
    }

    /// GETTERS AND SETTERS
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
}
