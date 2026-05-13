package com.gg.turnlook.Backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sucursales")
public class Sucursal {

    /// ATRIBUTOS

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String direccion;

    @Column(nullable = true)
    private String telefono;

    @Column(nullable = false)
    private String descripcion;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(nullable = true)
    private String mpToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleador_id")
    private Usuario empleador;

    /// hacer el onetomany de servicios

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "sucursal_empleados",
            joinColumns = @JoinColumn(name = "sucursal_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    @JsonIgnoreProperties("sucursalesEmpleado")
    private Set<Usuario> empleados = new HashSet<>();

    @PrePersist
    public void prePersist() {
        this.fechaCreacion = LocalDateTime.now();
    }


    /// CONSTRUCTORES
    public Sucursal(Integer id, String nombre, String direccion, String telefono, String descripcion, LocalDateTime fechaCreacion, boolean activo, String mpToken, Categoria categoria, Usuario usuario) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
        this.activo = activo;
        this.mpToken = mpToken;
        this.categoria = categoria;
        this.empleador = usuario;
    }

    public Sucursal(String nombre, String direccion, String telefono, String descripcion, Categoria categoria, Usuario usuario) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.empleador = usuario;
    }

    public Sucursal() {
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

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Usuario getEmpleador() {
        return empleador;
    }

    public void setEmpleador(Usuario empleador) {
        this.empleador = empleador;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getMpToken() {
        return mpToken;
    }

    public void setMpToken(String mpToken) {
        this.mpToken = mpToken;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Set<Usuario> getEmpleados() {
        return empleados;
    }

    public void setEmpleados(Set<Usuario> empleados) {
        this.empleados = empleados;
    }
}
