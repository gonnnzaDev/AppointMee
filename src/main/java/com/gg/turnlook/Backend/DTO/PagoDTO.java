package com.gg.turnlook.Backend.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

import java.math.BigDecimal;

@Data
public class PagoDTO {

    @NotBlank(message = "El titulo es obligatorio")
    @Size(min = 8, max = 50, message = "El titulo tiene q estar entre los 8 y 50 caracteres")
    private String titulo;

    @NotBlank(message = "La descripcion es obligatoria")
    @Size(min = 12, max = 120, message = "La descripcion tiene q estar entre los 8 y 120 caracteres")
    private String descripcion;

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a cero")
    private Integer cantidad;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a cero")
    private BigDecimal precio;

    // aca el token


}
