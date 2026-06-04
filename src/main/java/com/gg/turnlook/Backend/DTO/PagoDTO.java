package com.gg.turnlook.Backend.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class PagoDTO {

    @NotNull(message = "El ID del turno es obligatorio")
    @Positive(message = "El ID del turno debe ser mayor a cero")
    private Integer turnoId;

}
