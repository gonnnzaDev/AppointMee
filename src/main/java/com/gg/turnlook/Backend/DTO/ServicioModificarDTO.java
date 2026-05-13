package com.gg.turnlook.Backend.DTO;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class ServicioModificarDTO {

    @Size(min = 4, max = 60, message = "El nombre debe estar entre 4 y 60 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s,-]+$",
            message = "El nombre solo puede tener letras y espacios")
    private String nombre;

    @Size(min = 10, max = 500, message = "La descripcion debe estar entre 10 y 500 caracteres")
    private String descripcion;

    @Min(value = 10, message = "La duracion minima es de 10 minutos")
    @Max(value = 360, message = "La duracion maxima es de 360 minutos (6 horas)")
    private Integer duracion;

    @DecimalMin(value = "0.01", message = "El precio minimo es 0.01")
    @DecimalMax(value = "999999.99", message = "El precio maximo es 999999.99")
    @Digits(integer = 6, fraction = 2,
            message = "El precio debe tener a lo sumo 6 enteros y 2 decimales")
    private BigDecimal precio;

    @Positive(message = "El ID de sucursal debe ser positivo")
    private Integer sucursalId;


    /// CONSTRUCTORES
    public ServicioModificarDTO(String nombre, String descripcion, Integer duracion, BigDecimal precio) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.precio = precio;
    }

    public ServicioModificarDTO() {
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

    public Integer getSucursalId() {
        return sucursalId;
    }

    public void setSucursalId(Integer sucursalId) {
        this.sucursalId = sucursalId;
    }
}
