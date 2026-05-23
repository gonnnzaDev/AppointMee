package com.gg.turnlook.Backend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

import java.util.List;

@Entity
@Table(name = "categorias")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Categoria {

    /// ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String categoria;

    @OneToMany(mappedBy = "categoria")
    @JsonIgnore
    private List<Sucursal> sucursales;

    /// CONSTRUCTORES
    public Categoria(String nombre) {
        this.categoria = nombre;
    }



}
