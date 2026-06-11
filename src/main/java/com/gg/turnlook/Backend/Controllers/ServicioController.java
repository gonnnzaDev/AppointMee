package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Servicio.ServicioCrearDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.ServicioService;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {



    private final ServicioService servicioService;
    private final SesionService sesionService;
    private final SucursalService sucursalService;
    private final UsuarioService usuarioService;



    public ServicioController(ServicioService servicioService, SesionService sesionService, SucursalService sucursalService, UsuarioService usuarioService) {
        this.servicioService = servicioService;
        this.sesionService = sesionService;
        this.sucursalService = sucursalService;
        this.usuarioService = usuarioService;
    }


    /// ENDPOINTS



    @PreAuthorize("hasAnyRole('EMPLEADO','EMPLEADOR')")
    @PostMapping("/crear")
    public ResponseEntity<?> crearServicio(@Valid @RequestBody ServicioCrearDTO servicio,
                                           Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        if (!sucursalService.enSucursal(user.getId(), servicio.getSucursalId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        servicioService.crearServicio(servicio);
        return ResponseEntity.ok().body("Se creó el servicio");
    }


    @PreAuthorize("hasAnyRole('EMPLEADO','EMPLEADOR')")
    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarServicio(@PathVariable("id") Integer id,
                                               @Valid @RequestBody ServicioModificarDTO servicio,
                                               Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Servicio serv = servicioService.listarServicioPorId(id);

        if (!sucursalService.enSucursal(user.getId(), serv.getSucursal().getId())){
            throw new ForbiddenException("No perteneces a esta sucursal");
        }

        servicioService.modificarServicio(servicio, serv);
        return ResponseEntity.ok().body("Se modificó el servicio correctamente");
    }


    // ver si admin tmb pero no creo
    @PreAuthorize("hasRole('EMPLEADOR')")
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarServicio(@PathVariable("id") Integer id,
                                              Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        Servicio servicio = servicioService.listarServicioPorId(id);

        if (!sucursalService.enSucursal(user.getId(), servicio.getSucursal().getId())) {
            throw new ForbiddenException("No perteneces a esta sucursal");
        }

        servicioService.eliminarServicio(servicio);
        return ResponseEntity.ok().body("Se elimino el servicio correctamente");
    }


    @GetMapping("/listar/sucursal/{idSucursal}")
    public ResponseEntity<?> listarServicios(@PathVariable("idSucursal") Integer idSucursal,
                                             Authentication auth) {

        return ResponseEntity.ok().body(servicioService.listarServiciosSucursal(idSucursal));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> listarServiciosPorId(@PathVariable("id")Integer id, HttpSession sesion) {

        return ResponseEntity.ok().body(servicioService.verServicioPorId(id));
    }
}
