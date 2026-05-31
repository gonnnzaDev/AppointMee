package com.gg.turnlook.Backend.DTO.Sucursal;

import com.gg.turnlook.Backend.DTO.Usuario.UsuarioMiniDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SucursalMostrarDTO {

     private Integer id;  // ver si dsp lo saco
     private String nombre;
     private String direccion;
     private String telefono;
     private String descripcion;
     private LocalDate fechaCreacion;
     private String categoria;
     private LocalTime horaApertura;
     private LocalTime horaCierre;
     private UsuarioMiniDTO empleador;
     private Set<UsuarioMiniDTO> empleados;
}
