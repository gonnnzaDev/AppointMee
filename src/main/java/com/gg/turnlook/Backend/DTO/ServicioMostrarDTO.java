package com.gg.turnlook.Backend.DTO;

import java.math.BigDecimal;

public class ServicioMostrarDTO {

     /// ATRIBUTOS
     private String nombre;
     private String descripcion;
     private Integer duracion;
     private BigDecimal precio;

     /// CONSTRUCTORES
    public ServicioMostrarDTO(String nombre, String descripcion, Integer duracion, BigDecimal precio) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.precio = precio;
    }

    /// GETTERS AND SETTERS
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getDuracion() {
        return duracion;
    }

    public void setDuracion(Integer duracion) {
        this.duracion = duracion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }
}
