package com.gg.turnlook.Backend.Controllers;



import com.gg.turnlook.Backend.DTO.Servicio.ServicioCrearDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioModificarDTO;
import com.gg.turnlook.Backend.Service.ServicioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {



    private final ServicioService servicioService;


    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }


    /// ENDPOINTS


    // ver si saco empleado
    @PreAuthorize("hasAnyRole('EMPLEADO','EMPLEADOR')")
    @PostMapping("/crear")
    public ResponseEntity<?> crearServicio(@Valid @RequestBody ServicioCrearDTO servicio,
                                           @AuthenticationPrincipal String userEmail) {

        servicioService.crearServicio(servicio, userEmail);
        return ResponseEntity.ok().body("Se creó el servicio");
    }


    // ver si saco empleado
    @PreAuthorize("hasAnyRole('EMPLEADO','EMPLEADOR')")
    @PatchMapping("/modificar/{servicioId}")
    public ResponseEntity<?> modificarServicio(@PathVariable("servicioId") Integer servicioId,
                                               @Valid @RequestBody ServicioModificarDTO servicio,
                                               @AuthenticationPrincipal String userEmail) {

        servicioService.modificarServicio(servicio, servicioId, userEmail);
        return ResponseEntity.ok().body("Se modificó el servicio correctamente");
    }


    // ver si admin tmb pero no creo
    @PreAuthorize("hasRole('EMPLEADOR')")
    @DeleteMapping("/eliminar/{servicioId}")
    public ResponseEntity<?> eliminarServicio(@PathVariable("servicioId") Integer servicioId,
                                              @AuthenticationPrincipal String empleadorEmail) {

        servicioService.eliminarServicio(servicioId, empleadorEmail);
        return ResponseEntity.ok().body("Se elimino el servicio correctamente");
    }


    @GetMapping("/listar/sucursal/{idSucursal}")
    public ResponseEntity<?> listarServicios(@PathVariable("idSucursal") Integer idSucursal) {

        return ResponseEntity.ok().body(servicioService.listarServiciosSucursal(idSucursal));
    }


    @GetMapping("/{servicioId}")
    public ResponseEntity<?> listarServiciosPorId(
            @PathVariable("servicioId") Integer servicioId) {

        return ResponseEntity.ok().body(servicioService.verServicioPorId(servicioId));
    }


}





