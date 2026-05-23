package com.gg.turnlook.Backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sucursales")
@Data
@AllArgsConstructor
@NoArgsConstructor
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
    public Sucursal(String nombre, String direccion, String telefono, String descripcion, Categoria categoria, Usuario usuario) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.empleador = usuario;
    }

}
