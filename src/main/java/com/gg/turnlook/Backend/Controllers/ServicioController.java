package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Servicio.ServicioCrearDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Service.ServicioService;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    private final ServicioService servicioService;
    private final SesionService sesionService;
    private final SucursalService sucursalService;

    public ServicioController(ServicioService servicioService, SesionService sesionService, SucursalService sucursalService) {
        this.servicioService = servicioService;
        this.sesionService = sesionService;
        this.sucursalService = sucursalService;
    }


    /// ENDPOINTS

    @PostMapping("/crear")
    public ResponseEntity<?> crearServicio(@Valid @RequestBody ServicioCrearDTO servicio,
                                           HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        if (!sucursalService.enSucursal(sesionService.getUsuarioId(sesion), servicio.getSucursalId())) {
            throw new ForbiddenException("No perteneces a esta sucursal");
        }

        servicioService.crearServicio(servicio);
        return ResponseEntity.ok().body("Se creo el servicio");
    }


    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarServicio(@PathVariable("id") Integer id,
                                               @Valid @RequestBody ServicioModificarDTO servicio,
                                               HttpSession sesion) {
        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        if (!sucursalService.enSucursal(sesionService.getUsuarioId(sesion), servicio.getSucursalId())) {
            throw new ForbiddenException("No perteneces a esta sucursal");
        }

        servicioService.modificarServicio(servicio, id);
        return ResponseEntity.ok().body("Se modificó el servicio correctamente");
    }


    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarServicio(@PathVariable("id") Integer id,
                                              HttpSession sesion) {
        sesionService.isLogged(sesion);
        boolean esAdmin = sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name());

        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) && !esAdmin) {
            throw new ForbiddenException("No tenes permisos");
        }

        Servicio servicio = servicioService.listarServicioPorId(id);

        if (!esAdmin && !sucursalService.enSucursal(sesionService.getUsuarioId(sesion),
                servicio.getSucursal().getId())) {
            throw new ForbiddenException("No perteneces a esta sucursal");
        }

        servicioService.eliminarServicio(servicio);
        return ResponseEntity.ok().body("Se elimino el servicio correctamente");
    }

    // ver un endpoint para mostrar servicios x nombre con DTO para todo publico

    @GetMapping("/listar/{idSucursal}")
    public ResponseEntity<?> listarServicios(@PathVariable("idSucursal") Integer idSucursal,
                                             HttpSession sesion) {

        sesionService.isLogged(sesion);
        boolean esAdmin = sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name());

        if (!esAdmin && !sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        Sucursal sucursal = sucursalService.listarSucursalPorId(idSucursal);

        // mirar este mejor a ver si funca bien
        if (!esAdmin && !sucursalService.enSucursal(sesionService.getUsuarioId(sesion),
                sucursal.getId())) {
            throw new ForbiddenException("No perteneces a esta sucursal");
        }

        if (esAdmin) {
            return ResponseEntity.ok().body(servicioService.listarServiciosPorSucursalAdmin(idSucursal));
        } else {
            return ResponseEntity.ok().body(servicioService.listarServiciosPorSucursalPropia(idSucursal));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listarServiciosPorId(@PathVariable("id") Integer id, HttpSession sesion) {

        sesionService.isLogged(sesion);

        // ver con twin dsp para q cada empleador vea el suyo
        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        Servicio servicio = servicioService.listarServicioPorId(id);
        return ResponseEntity.ok().body(servicio);
    }
}
