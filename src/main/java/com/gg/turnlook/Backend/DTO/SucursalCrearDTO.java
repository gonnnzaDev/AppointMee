package com.gg.turnlook.Backend.DTO;

import com.gg.turnlook.Backend.Model.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SucursalCrearDTO {


    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 4, max = 60, message = "El nombre debe estar entre 4 y 60 caracteres")
    private String nombre;

    @NotBlank(message = "La direccion es obligatoria")
    @Size(min = 10, max = 60, message = "La direccion debe estar entre 10 y 60 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\d]+$",
             message = "La direccion solo debe contener letras y numeros")
    private String direccion;

    @Size(min = 8, max = 15, message = "El telefono debe estar entre los 8 y 15 digitos")
    @Pattern(regexp = "^[\\d]+$" , message = "El numero solo puede contener numeros")
    private String telefono;

    @NotBlank(message = "La descripcion es obligatoria")
    @Size(min = 10, max = 255, message = "La descripcion debe estar entre 10 y 255 caracteres")
    private String descripcion;

    @NotNull
    private Categoria categoria;

    /// CONSTRUCTORES
    public SucursalCrearDTO(String nombre, String direccion, String telefono, String descripcion) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.descripcion = descripcion;
    }

    public SucursalCrearDTO() {
    }

    /// GETTERS AND SETTERS
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}
