package com.gg.turnlook.Backend.DTO.Sucursal;

import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmpleadorResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SucursalMostrarDTO {

     private String nombre;
     private String direccion;
     private String telefono;
     private String descripcion;
     private LocalDate fechaCreacion;
     private String categoria;
     private UsuarioEmpleadorResponseDTO empleador;
     private Set<UsuarioEmpleadorResponseDTO> empleados;
}
