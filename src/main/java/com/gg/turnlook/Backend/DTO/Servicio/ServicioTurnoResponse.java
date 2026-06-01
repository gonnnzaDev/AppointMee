package com.gg.turnlook.Backend.DTO.Servicio;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServicioTurnoResponse {

    private Integer id;
    private BigDecimal precio;
    // seguir
}
