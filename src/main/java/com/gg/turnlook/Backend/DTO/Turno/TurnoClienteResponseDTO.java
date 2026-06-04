package com.gg.turnlook.Backend.DTO.Turno;



import com.gg.turnlook.Backend.DTO.Servicio.ServicioTurnoResponseDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioMiniDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurnoClienteResponseDTO {

    private LocalDateTime fechaReserva;
    private LocalDateTime fechaHora;
    private UsuarioMiniDTO empleado;
    private ServicioTurnoResponseDTO servicio;
    private UsuarioMiniDTO cliente;
}
