package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Imagen.ImagenDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalCrearDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalModificarDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmailDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;


@RestController
@RequestMapping("/sucursales")
@CrossOrigin(origins = "*")
public class SucursalController {


    private final SucursalService sucursalService;
    private final SesionService sesionService;
    private final UsuarioService usuarioService;



    public SucursalController(SucursalService sucursalService, UsuarioService usuarioService, SesionService sesionService, UsuarioService usuarioService1) {
        this.sucursalService = sucursalService;
        this.sesionService = sesionService;
        this.usuarioService = usuarioService1;
    }


    /// ENDPOINTS


    @PreAuthorize("hasRole('EMPLEADOR')")
    @PostMapping("/crear")
    public ResponseEntity<?> crearSucursal(
            @Valid @RequestBody SucursalCrearDTO sucursal, Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        sucursalService.crearSucursal(sucursal, user.getId());
        return ResponseEntity.ok().body("Se creó la sucursal");
    }


    // ver si saco ADMIN , seguro si
    @PreAuthorize("hasAnyRole('EMPLEADOR','ADMINISTRADOR')")
    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarSucursal(@PathVariable("id") Integer id,
                                               @Valid @RequestBody SucursalModificarDTO sucursal,
                                               Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Sucursal suc = sucursalService.listarSucursalPorId(id);

        if (!sesionService.tieneRol(user, ERol.ADMINISTRADOR.name()) &&
                !Objects.equals(user.getId(), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        sucursalService.modificarSucursal(sucursal, suc);
        return ResponseEntity.ok().body("Se modificó la sucursal");
    }


    // ver si admin tmb
    @PreAuthorize("hasRole('EMPLEADOR')")
    @GetMapping("/{sucursalId}/imagenes")
    public ResponseEntity<?> verImagenesPorSucursal(
            @PathVariable("sucursalId") Integer sucursalId,
            Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Sucursal suc = sucursalService.listarSucursalPorId(sucursalId);

        if (!sucursalService.enSucursal(user.getId(), sucursalId)) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(sucursalService.listarImagenesPorSucursal(suc));
    }


    @PreAuthorize("hasRole('EMPLEADOR')")
    @PostMapping("/{sucursalId}/agregar/imagenes")
    public ResponseEntity<?> agregarImagenes(@PathVariable("sucursalId") Integer sucursalId,
                                             @Valid @RequestBody ImagenDTO imagenes,
                                             Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        if (!sucursalService.enSucursal(user.getId(), sucursalId)) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal suc =  sucursalService.listarSucursalPorId(sucursalId);

        sucursalService.agregarImagenes(imagenes, suc);
        return ResponseEntity.ok().body("Se agregaron las imagenes a la sucursal");
    }


    // ver si admin tmb
    @PreAuthorize("hasRole('EMPLEADOR')")
    @DeleteMapping("/{sucursalId}/eliminar/imagen/{imagenId}")
    public ResponseEntity<?> eliminarImagen(@PathVariable("sucursalId") Integer sucursalId,
                                            @PathVariable("imagenId") Integer imagenId,
                                            Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        if (!sucursalService.enSucursal(user.getId(), sucursalId)) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal suc =  sucursalService.listarSucursalPorId(sucursalId);

        sucursalService.eliminarImagen(imagenId, suc);
        return ResponseEntity.ok().body("Se eliminó la imagen de la sucursal");
    }


    @PreAuthorize("hasAnyRole('EMPLEADOR','ADMINISTRADOR')")
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarSucursal(@PathVariable("id") Integer id,
                                              Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        if (!sesionService.tieneRol(user, ERol.ADMINISTRADOR.name()) &&
                !sucursalService.enSucursal(user.getId(), id)) {
            throw new ForbiddenException("No tenes permisos");
        }

        sucursalService.eliminarSucursal(id);
        return ResponseEntity.ok().body("Se eliminó la sucursal");
    }


    @GetMapping("/listar")
    public ResponseEntity<?> listarSucursales(Authentication auth) {

        return ResponseEntity.ok().body(sucursalService.listarSucursales());
    }


    @GetMapping("/listar/filtrar")
    public ResponseEntity<?> filtrarListaSucursales(@RequestParam(required = false) Integer catId,
                                                    @RequestParam(required = false) String nombre,
                                                    Authentication auth) {

        return ResponseEntity.ok().body(sucursalService.filtrarListaSucursales(catId, nombre));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> sucursalPorId(@PathVariable("id") Integer id,
                                           Authentication auth) {

        return ResponseEntity.ok().body(sucursalService.verSucursalPorId(id));
    }


    @PreAuthorize("hasAnyRole('EMPLEADOR','ADMINISTRADOR')")
    @GetMapping("/{sucursalId}/empleados")
    public ResponseEntity<?> empleadosPorSucursal(@PathVariable("sucursalId") Integer sucursalId,
                                                  Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        boolean esAdmin = sesionService.tieneRol(user, ERol.ADMINISTRADOR.name());

        Sucursal suc = sucursalService.listarSucursalPorId(sucursalId);

        if (!esAdmin && !Objects.equals(user.getId(), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return esAdmin ? ResponseEntity.ok().body(sucursalService.verEmpleadosAdmin(sucursalId))
                : ResponseEntity.ok().body(sucursalService.verEmpleadosEmpleador(sucursalId));
    }


    @PreAuthorize("hasRole('EMPLEADOR')")
    @PostMapping("/{sucursalId}/empleados")
    public ResponseEntity<?> agregarEmpleado(@PathVariable("sucursalId") Integer sucursalId,
                                             @Valid @RequestBody UsuarioEmailDTO userEmail,
                                             Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Sucursal suc = sucursalService.listarSucursalPorId(sucursalId);

        if (!Objects.equals(user.getId(), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        // dsp cambiar a "se envió una notificación" o algo asi cuando tenga hecho lo de notif
        sucursalService.agregarEmpleado(suc, userEmail);
        return ResponseEntity.ok().body("Se agregó al empleado correctamente");
    }


    @PreAuthorize("hasRole('EMPLEADOR')")
    @DeleteMapping("/{sucursalId}/empleados/{empleadoId}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable("sucursalId") Integer sucursalId,
                                              @PathVariable("empleadoId") Integer empleadoId,
                                              Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Sucursal suc = sucursalService.listarSucursalPorId(sucursalId);

        if (!Objects.equals(user.getId(), suc.getEmpleador().getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        sucursalService.eliminarEmpleado(suc, empleadoId);
        return ResponseEntity.ok().body("Se eliminó al empleado correctamente");
    }
}