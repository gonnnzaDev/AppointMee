package com.gg.turnlook.Backend.DTO.Turno;


import com.gg.turnlook.Backend.DTO.Servicio.ServicioTurnoResponseDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmpleadorResponseDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioMiniDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurnoMostrarDTO {

    private Integer id;
    private LocalDateTime fechaReserva;
    private LocalDateTime fechaTurno;
    private UsuarioMiniDTO cliente;
    private UsuarioEmpleadorResponseDTO empleado;
    private ServicioTurnoResponseDTO servicio;

}
