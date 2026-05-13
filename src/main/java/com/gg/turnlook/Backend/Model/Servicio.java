package com.gg.turnlook.Backend.Model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "servicios")
public class Servicio {

    /// ATRIBUTOS

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private Integer duracion;

    @Column(nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sucursal_id")
    private Sucursal sucursal;


    /// CONSTRUCTORES
    public Servicio(Integer id, String nombre, String descripcion, Integer duracion, BigDecimal precio, boolean activo, Sucursal sucursal) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.precio = precio;
        this.activo = activo;
        this.sucursal = sucursal;
    }

    public Servicio(String nombre, String descripcion, Integer duracion, BigDecimal precio, Sucursal sucursal) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.precio = precio;
        this.sucursal = sucursal;
    }

    public Servicio() {
    }


    /// GETTERS AND SETTERS
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Sucursal getSucursal() {
        return sucursal;
    }

    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
    }
}
