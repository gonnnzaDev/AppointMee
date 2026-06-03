package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Turno.TurnoCrearDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Enum.EstadoTurno;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.TurnoService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {

    private final TurnoService turnoService;
    private final SesionService sesionService;

    public TurnoController(TurnoService turnoService, SesionService sesionService) {
        this.turnoService = turnoService;
        this.sesionService = sesionService;
    }


    /// ENDPOINTS


    @PostMapping("/registrar")
    // solo clientes
    public ResponseEntity<?> registrarTurno(@Valid @RequestBody TurnoCrearDTO turno,
                                            HttpSession sesion) {
        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.CLIENTE.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        if (!Objects.equals(turno.getClienteId(), sesionService.getUsuarioId(sesion))) {
            throw new ForbiddenException("No podes reservar turnos para otros usuarios");
        }

        turnoService.registrarTurno(turno);
        return ResponseEntity.ok().body("Se reservó el turno correctamente");
    }


    @GetMapping("/disponibilidad/empleado/{empleadoId}/servicio/{servicioId}")
    public ResponseEntity<?> verDisponibilidad(@PathVariable("empleadoId") Integer empleadoId,
                                               @PathVariable("servicioId") Integer servicioId,
                                               HttpSession sesion) {
        sesionService.isLogged(sesion);

        return ResponseEntity.ok().body(turnoService.verDisponibilidad(empleadoId, servicioId));
    }


    @DeleteMapping("/cancelar/{turnoId}")
    public ResponseEntity<?> cancelarTurno(@PathVariable("turnoId") Integer turnoId,
                                           HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        turnoService.cancelarTurno(turnoId);
        return ResponseEntity.ok().body("Se canceló el turno correctamente");
    }


    @PatchMapping("/finalizar/{turnoId}")
    public ResponseEntity<?> finalizarTurno(@PathVariable("turnoId") Integer turnoId,
                                            HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        turnoService.finalizarTurno(turnoId);
        return ResponseEntity.ok().body("Se finalizó el turno correctamente");
    }


    @GetMapping("/{estadoTurno}/sucursal/{sucursalId}")
    public ResponseEntity<?> listarTurnosPorSucursal(
            @PathVariable("estadoTurno") EstadoTurno estadoTurno,
            @PathVariable("sucursalId") Integer sucursalId, HttpSession sesion) {

        Usuario empleador = sesionService.getUsuarioLogged(sesion);

        // ver si admin tmb
        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(turnoService.listarTurnosPorSucursalYEstado(
                sucursalId, empleador, estadoTurno));
    }


    @GetMapping("/{turnoId}/sucursal/{sucursalId}")
    public ResponseEntity<?> verDetallesTurnosPorSucursal(
            @PathVariable("turnoId") Integer turnoId,
            @PathVariable("sucursalId") Integer sucursalId, HttpSession sesion) {

        Usuario empleador = sesionService.getUsuarioLogged(sesion);

        // ver si admin tmb
        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(turnoService.verDetalleTurnoPorSucursal(
                turnoId, sucursalId, empleador));
    }

    // admin no (dsp con spring security)
    @GetMapping("/propios/{estadoTurno}")
    public ResponseEntity<?> listarTurnosPropios(@PathVariable("estadoTurno") EstadoTurno estadoTurno,
                                                 HttpSession sesion) {

        Usuario cliente = sesionService.getUsuarioLogged(sesion);

        return ResponseEntity.ok().body(turnoService.listarTurnosPorCliente(cliente, estadoTurno));
    }

    // admin no (dsp con spring sec)
    @GetMapping("/propios/detalles/{turnoId}")
    public ResponseEntity<?> verDetallesTurnosPropios(@PathVariable("turnoId") Integer turnoId,
                                                      HttpSession sesion) {

        Usuario cliente = sesionService.getUsuarioLogged(sesion);

        return ResponseEntity.ok().body(turnoService.verDetalleTurnoPropio(cliente, turnoId));
    }
}
