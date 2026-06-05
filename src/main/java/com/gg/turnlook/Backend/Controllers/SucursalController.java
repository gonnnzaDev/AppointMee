package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Sucursal.SucursalCrearDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalModificarDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmailDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/sucursales")
@CrossOrigin(origins = "http://localhost:3000")
public class SucursalController {

    private final SucursalService sucursalService;
    private final SesionService sesionService;

    public SucursalController(SucursalService sucursalService, UsuarioService usuarioService, SesionService sesionService) {
        this.sucursalService = sucursalService;
        this.sesionService = sesionService;
    }


    /// ENDPOINTS

    // endpoint para empezar a crear tu sucursal (dsp lo hag)

    // dsp cambiar a spring security para validar sin http sesion manual
    @PostMapping("/crear")
    public ResponseEntity<?> crearSucursal(
            @Valid @RequestBody SucursalCrearDTO sucursal,
            HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        sucursalService.crearSucursal(sucursal, sesionService.getUsuarioId(sesion));
        return ResponseEntity.ok().body("Se creó la sucursal");
    }


    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarSucursal(@PathVariable("id") Integer id,
                                               @Valid @RequestBody SucursalModificarDTO sucursal,
                                               HttpSession sesion) {

        sesionService.isLogged(sesion);
        boolean esAdmin = sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name());

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) && !esAdmin) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal suc = sucursalService.listarSucursalPorId(id);

        if (!esAdmin && !Objects.equals(sesionService.getUsuarioId(sesion), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        sucursalService.modificarSucursal(sucursal, suc);
        return ResponseEntity.ok().body("Se modificó la sucursal");
    }


    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarSucursal(@PathVariable("id") Integer id, HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        sucursalService.eliminarSucursal(id);
        return ResponseEntity.ok().body("Se eliminó la sucursal");
    }


    @GetMapping("/listar")
    public ResponseEntity<?> listarSucursales(HttpSession sesion) {

        sesionService.isLogged(sesion);

        return ResponseEntity.ok().body(sucursalService.listarSucursales());
    }


    @GetMapping("/listar/filtrar")
    public ResponseEntity<?> filtrarListaSucursales(@RequestParam(required = false) Integer catId,
                                                    @RequestParam(required = false) String nombre,
                                                    HttpSession sesion) {

        sesionService.isLogged(sesion);

        return ResponseEntity.ok().body(sucursalService.filtrarListaSucursales(catId, nombre));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> sucursalPorId(@PathVariable("id") Integer id, HttpSession sesion) {

        sesionService.isLogged(sesion);

        return ResponseEntity.ok().body(sucursalService.verSucursalPorId(id));
    }


    @GetMapping("/{sucursalId}/empleados")
    public ResponseEntity<?> empleadosPorSucursal(@PathVariable("sucursalId") Integer sucursalId,
                                                  HttpSession sesion) {
        sesionService.isLogged(sesion);
        boolean esAdmin = sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name());

        if (!esAdmin && !sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal suc = sucursalService.listarSucursalPorId(sucursalId);

        if (!esAdmin && !Objects.equals(sesionService.getUsuarioId(sesion), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return esAdmin ? ResponseEntity.ok().body(sucursalService.verEmpleadosAdmin(sucursalId))
                : ResponseEntity.ok().body(sucursalService.verEmpleadosEmpleador(sucursalId));
    }


    @PostMapping("/{sucursalId}/empleados")
    public ResponseEntity<?> agregarEmpleado(@PathVariable("sucursalId") Integer sucursalId,
                                             @Valid @RequestBody UsuarioEmailDTO userEmail,
                                             HttpSession sesion) {
        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal suc = sucursalService.listarSucursalPorId(sucursalId);
        if (!Objects.equals(sesionService.getUsuarioId(sesion), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        // dsp cambiar a "se envió una notificación" o algo asi cuando tenga hecho lo de notif
        sucursalService.agregarEmpleado(suc, userEmail);
        return ResponseEntity.ok().body("Se agregó al empleado correctamente");
    }


    @DeleteMapping("/{sucursalId}/empleados/{empleadoId}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable("sucursalId") Integer sucursalId,
                                              @PathVariable("empleadoId") Integer empleadoId,
                                              HttpSession sesion) {
        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal suc = sucursalService.listarSucursalPorId(sucursalId);
        if (!Objects.equals(sesionService.getUsuarioId(sesion), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        sucursalService.eliminarEmpleado(suc, empleadoId);
        return ResponseEntity.ok().body("Se eliminó al empleado correctamente");
    }
}