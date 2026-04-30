package com.gg.turnlook.Model;

public class ReqInicioSesion {

    /// ATRIBUTOS
    private String email;
    private String pass;

    /// CONSTRUCTORES
    public ReqInicioSesion(String email, String pass) {
        this.email = email;
        this.pass = pass;
    }

    public ReqInicioSesion() {
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
