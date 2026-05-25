package com.gg.turnlook.Backend.DTO.Servicio;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicioMostrarDTO {

     /// ATRIBUTOS
     private String nombre;
     private String descripcion;
     private Integer duracion;
     private BigDecimal precio;
     private String nombreSucursal;
     private String direccionSucursal;
     private String categoriaSucursal;
}
