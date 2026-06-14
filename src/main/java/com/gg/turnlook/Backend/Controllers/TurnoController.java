package com.gg.turnlook.Backend.Controllers;




import com.gg.turnlook.Backend.DTO.Turno.TurnoCrearDTO;
import com.gg.turnlook.Backend.Service.SucursalService;
import com.gg.turnlook.Backend.Service.TurnoService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {


    private final TurnoService turnoService;
    private final UsuarioService usuarioService;
    private final SucursalService sucursalService;


    public TurnoController(TurnoService turnoService, UsuarioService usuarioService, SucursalService sucursalService) {
        this.turnoService = turnoService;

        this.usuarioService = usuarioService;
        this.sucursalService = sucursalService;
    }


    /// ENDPOINTS


    @PreAuthorize("hasRole('CLIENTE')")
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarTurno(@Valid @RequestBody TurnoCrearDTO turno,
                                            @AuthenticationPrincipal String clienteEmail) {

        turnoService.registrarTurno(turno, clienteEmail);
        return ResponseEntity.ok().body("Se reservó el turno correctamente");
    }


    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/disponibilidad/empleado/{empleadoId}/servicio/{servicioId}")
    public ResponseEntity<?> verDisponibilidad(@PathVariable("empleadoId") Integer empleadoId,
                                               @PathVariable("servicioId") Integer servicioId) {

        return ResponseEntity.ok().body(turnoService.verDisponibilidad(empleadoId, servicioId));
    }


    // ver si tambien EMPLEADO puede jojujujaja
    @PreAuthorize("hasRole('EMPLEADOR')")
    @DeleteMapping("/cancelar/{turnoId}")
    public ResponseEntity<?> cancelarTurno(@PathVariable("turnoId") Integer turnoId,
                                           @AuthenticationPrincipal String empleadorEmail) {

        turnoService.cancelarTurno(turnoId, empleadorEmail);
        return ResponseEntity.ok().body("Se canceló el turno correctamente");
    }


    @PreAuthorize("hasAnyRole('EMPLEADOR','EMPLEADO')")
    @PatchMapping("/finalizar/{turnoId}")
    public ResponseEntity<?> finalizarTurno(@PathVariable("turnoId") Integer turnoId,
                                            @AuthenticationPrincipal String userEmail) {

        turnoService.finalizarTurno(turnoId, userEmail);
        return ResponseEntity.ok().body("Se finalizó el turno correctamente");
    }


    // ver si ADMIN tmb 67
    @PreAuthorize("hasAnyRole('EMPLEADOR','EMPLEADO')")
    @GetMapping("/de-sucursal/{sucursalId}")
    public ResponseEntity<?> listarTurnosPorSucursal(
            @PathVariable("sucursalId") Integer sucursalId,
            @AuthenticationPrincipal String userEmail) {

        return ResponseEntity.ok().body(turnoService.listarTurnosPorSucursal(
                sucursalId, userEmail));
    }


    // ver si ADMIN tmb 69
    @PreAuthorize("hasAnyRole('EMPLEADOR','EMPLEADO')")
    @GetMapping("/de-sucursal/detalles/{turnoId}")
    public ResponseEntity<?> verDetallesTurnosPorSucursal(
            @PathVariable("turnoId") Integer turnoId,
            @AuthenticationPrincipal String userEmail) {

        return ResponseEntity.ok().body(turnoService.verDetalleTurnoPorSucursal(
                turnoId, userEmail));
    }


    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/propios")
    public ResponseEntity<?> listarTurnosPropios(@AuthenticationPrincipal String clienteEmail) {

        return ResponseEntity.ok().body(turnoService.listarTurnosPorCliente(clienteEmail));
    }


    @PreAuthorize("hasAnyRole('CLIENTE')")
    @GetMapping("/propios/detalles/{turnoId}")
    public ResponseEntity<?> verDetallesTurnosPropios(
            @PathVariable("turnoId") Integer turnoId,
            @AuthenticationPrincipal String clienteEmail) {

        return ResponseEntity.ok().body(turnoService.verDetalleTurnoPropio(
                clienteEmail, turnoId));
    }


}




