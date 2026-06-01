package com.gg.turnlook.Backend.DTO.Turno;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurnoMiniDTO {

    private String nombreServicio;
    private LocalDate fechaTurno;
}
