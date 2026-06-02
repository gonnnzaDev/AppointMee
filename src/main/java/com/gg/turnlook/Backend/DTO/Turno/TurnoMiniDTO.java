package com.gg.turnlook.Backend.DTO.Turno;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurnoMiniDTO {

    private Integer id;
    private String nombreServicio;
    private LocalDateTime fechaTurno;
}
