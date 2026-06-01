package com.gg.turnlook.Backend.DTO.Turno;


import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmpleadorResponseDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioMiniDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurnoMostrarDTO {

    private Integer id;
    private LocalDateTime fechaReserva;
    private LocalDate fechaTurno;
    //private LocalTime inicioTurno;  ver si no o si
    //private LocalTime finTurno;
    private UsuarioMiniDTO cliente;
    private UsuarioEmpleadorResponseDTO empleado;
    // seguir

}
