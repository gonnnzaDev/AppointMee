package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Sucursal.SucursalCrearDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalModificarDTO;
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
@CrossOrigin(origins = "*")
public class SucursalController {

    private final SucursalService sucursalService;
    private final SesionService sesionService;

    public SucursalController(SucursalService sucursalService, UsuarioService usuarioService, SesionService sesionService) {
        this.sucursalService = sucursalService;
        this.sesionService = sesionService;
    }


    /// ENDPOINTS

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

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            Integer empleadorId = sesionService.getUsuarioId(sesion);
            return ResponseEntity.ok().body(sucursalService.listarSucursalesPropias(empleadorId));
        } else {
            return ResponseEntity.ok().body(sucursalService.listarSucursales());
        }
    }


    @GetMapping("/listar/filtrar")
    public ResponseEntity<?> filtrarListaSucursales(@RequestParam(required = false) String nombre,
                                                    @RequestParam(required = false) Boolean activo,
                                                    @RequestParam(required = false) Integer catId,
                                                    @RequestParam(required = false) Integer userId,
                                                    HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(sucursalService.filtrarListaSucursales(nombre, activo, catId, userId));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> sucursalPorId(@PathVariable("id") Integer id, HttpSession sesion) {

        sesionService.isLogged(sesion);
        boolean esAdmin = sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name());

        if (!esAdmin && !sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal sucursal = sucursalService.listarSucursalPorId(id);

        if (!esAdmin && !Objects.equals(sucursal.getEmpleador().getId(),
               sesionService.getUsuarioId(sesion))) {
            throw new ForbiddenException("Esta sucursal no te pertenece");
        }

        return esAdmin ? ResponseEntity.ok().body(sucursal)
                : ResponseEntity.ok().body(sucursalService.mapearSucursal(sucursal));
    }
}