package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Turno.TurnoCrearDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Enum.EstadoTurno;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Model.Turno;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import com.gg.turnlook.Backend.Service.TurnoService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;


@RestController
@RequestMapping("/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {


    private final TurnoService turnoService;
    private final SesionService sesionService;
    private final UsuarioService usuarioService;
    private final SucursalService sucursalService;


    public TurnoController(TurnoService turnoService, SesionService sesionService, UsuarioService usuarioService, SucursalService sucursalService) {
        this.turnoService = turnoService;
        this.sesionService = sesionService;
        this.usuarioService = usuarioService;
        this.sucursalService = sucursalService;
    }



    /// ENDPOINTS



    @PreAuthorize("hasRole('CLIENTE')")
    @PostMapping("/registrar")
    // solo clientes
    public ResponseEntity<?> registrarTurno(@Valid @RequestBody TurnoCrearDTO turno,
                                            Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        if (!Objects.equals(turno.getClienteId(), user.getId())) {
            throw new ForbiddenException("No podes reservar turnos para otros usuarios");
        }

        turnoService.registrarTurno(turno);
        return ResponseEntity.ok().body("Se reservó el turno correctamente");
    }


    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/disponibilidad/empleado/{empleadoId}/servicio/{servicioId}")
    public ResponseEntity<?> verDisponibilidad(@PathVariable("empleadoId") Integer empleadoId,
                                               @PathVariable("servicioId") Integer servicioId,
                                               Authentication auth) {

        return ResponseEntity.ok().body(turnoService.verDisponibilidad(empleadoId, servicioId));
    }


    // ver si tambien EMPLEADO puede jojujujaja
    @PreAuthorize("hasRole('EMPLEADOR')")
    @DeleteMapping("/cancelar/{turnoId}")
    public ResponseEntity<?> cancelarTurno(@PathVariable("turnoId") Integer turnoId,
                                           Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Turno turno = turnoService.listarTurnoPorId(turnoId);

        if (!Objects.equals(user.getId(),
                turno.getServicio().getSucursal().getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        turnoService.cancelarTurno(turno);
        return ResponseEntity.ok().body("Se canceló el turno correctamente");
    }


    @PreAuthorize("hasAnyRole('EMPLEADOR','EMPLEADO')")
    @PatchMapping("/finalizar/{turnoId}")
    public ResponseEntity<?> finalizarTurno(@PathVariable("turnoId") Integer turnoId,
                                            Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Turno turno = turnoService.listarTurnoPorId(turnoId);

        if(!sucursalService.enSucursal(user.getId(), turno.getServicio().getSucursal().getId())){
            throw new ForbiddenException("No tenes permisos");
        }

        turnoService.finalizarTurno(turno);
        return ResponseEntity.ok().body("Se finalizó el turno correctamente");
    }


    // ver si ADMIN tmb 67
    @PreAuthorize("hasAnyRole('EMPLEADOR','EMPLEADO')")
    @GetMapping("/{estadoTurno}/sucursal/{sucursalId}")
    public ResponseEntity<?> listarTurnosPorSucursal(
            @PathVariable("estadoTurno") EstadoTurno estadoTurno,
            @PathVariable("sucursalId") Integer sucursalId,
            Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Sucursal sucursal = sucursalService.listarSucursalPorId(sucursalId);

        if(!sucursalService.enSucursal(user.getId(), sucursal.getId())){
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(turnoService.listarTurnosPorSucursalYEstado(
                sucursal, user, estadoTurno));
    }


    // ver si ADMIN tmb 69
    @PreAuthorize("hasAnyRole('EMPLEADOR','EMPLEADO')")
    @GetMapping("/{turnoId}/sucursal/{sucursalId}")
    public ResponseEntity<?> verDetallesTurnosPorSucursal(
            @PathVariable("turnoId") Integer turnoId,
            @PathVariable("sucursalId") Integer sucursalId, Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Turno turno =  turnoService.listarTurnoPorId(turnoId);

        Sucursal sucursal = turno.getServicio().getSucursal(); // ver si puede dar null pero no creo

        if(!sucursalService.enSucursal(user.getId(), sucursal.getId())){
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(turnoService.verDetalleTurnoPorSucursal(turno));
    }


    @PreAuthorize("hasAnyRole('CLIENTE','EMPLEADO','EMPLEADOR')")
    @GetMapping("/propios/{estadoTurno}")
    public ResponseEntity<?> listarTurnosPropios(@PathVariable("estadoTurno") EstadoTurno estadoTurno,
                                                 Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario cliente = usuarioService.listarUsuarioPorEmail(email);

        return ResponseEntity.ok().body(turnoService.listarTurnosPorCliente(cliente, estadoTurno));
    }


    @PreAuthorize("hasAnyRole('CLIENTE','EMPLEADO','EMPLEADOR')")
    @GetMapping("/propios/detalles/{turnoId}")
    public ResponseEntity<?> verDetallesTurnosPropios(@PathVariable("turnoId") Integer turnoId,
                                                      Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario cliente = usuarioService.listarUsuarioPorEmail(email);

        return ResponseEntity.ok().body(turnoService.verDetalleTurnoPropio(cliente, turnoId));
    }


}
