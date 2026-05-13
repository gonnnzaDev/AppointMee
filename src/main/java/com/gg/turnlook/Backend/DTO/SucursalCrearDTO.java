package com.gg.turnlook.Backend.DTO;

import jakarta.validation.constraints.*;

public class SucursalCrearDTO {


    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 4, max = 120, message = "El nombre debe estar entre 4 y 120 caracteres")
    private String nombre;

    @NotBlank(message = "La direccion es obligatoria")
    @Size(min = 10, max = 60, message = "La direccion debe estar entre 10 y 60 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\d\\s.,#-]+$",
             message = "La direccion solo debe contener letras y numeros")
    private String direccion;

    @Size(min = 8, max = 20, message = "El telefono debe estar entre los 8 y 20 digitos")
    @Pattern(regexp = "^\\d+$" , message = "El telefono solo puede contener numeros")
    private String telefono;

    @NotBlank(message = "La descripcion es obligatoria")
    @Size(min = 10, max = 1500, message = "La descripcion debe estar entre 10 y 1500 caracteres")
    private String descripcion;

    @NotNull(message = "El ID de categoria es obligatorio")
    @Positive(message = "El ID de categoria debe ser positivo")
    private Integer categoriaId;

    /// CONSTRUCTORES
    public SucursalCrearDTO(String nombre, String direccion, String telefono, String descripcion, Integer categoriaId) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.descripcion = descripcion;
        this.categoriaId = categoriaId;
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

    public Integer getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }
}
