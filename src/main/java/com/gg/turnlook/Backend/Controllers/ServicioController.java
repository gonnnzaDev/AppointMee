package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.ServicioCrearDTO;
import com.gg.turnlook.Backend.DTO.ServicioModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Service.ServicioService;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
                                           HttpSession sesion){
        if(!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if(!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
           !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        if(!sucursalService.enSucursal((Integer) sesion.getAttribute("userId"),
            servicio.getSucursalId())){
            return ResponseEntity.status(403).body("No perteneces a esta sucursal");
        }

        try{
            servicioService.crearServicio(servicio);
            return ResponseEntity.ok().body("Se creo el servicio");
        }catch(Exception e){
            return ResponseEntity.status(500).body("Hubo un error al crear el servicio");
        }
    }

    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarServicio(@PathVariable("id") Integer servicioId,
                                               @Valid @RequestBody ServicioModificarDTO servicio,
                                               HttpSession sesion){
        if(!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        // ver si dsp admin tmb haria esto
        if(!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        if(!sucursalService.enSucursal((Integer) sesion.getAttribute("userId"),
                servicio.getSucursalId())){
            return ResponseEntity.status(403).body("No perteneces a esta sucursal");
        }

        try{
            return servicioService.modificarServicio(servicio, servicioId).isPresent() ?
                    ResponseEntity.ok().body("Se modifico el servicio correctamente")
                  : ResponseEntity.status(404).body("No se encontro el servicio");
        }catch(Exception e){
            return ResponseEntity.status(500).body("Hubo un error al modificar el servicio");
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarServicio(@PathVariable("id") Integer servicioId,
                                              HttpSession sesion){
        if(!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if(!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
                !sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        Optional<Servicio> servicio = servicioService.listarServicioPorId(servicioId);
        if(servicio.isEmpty()) return ResponseEntity.status(404).body("No se encontro el servicio");

        if(!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name()) &&
           !sucursalService.enSucursal((Integer) sesion.getAttribute("userId"),
             servicio.get().getSucursal().getId())){
            return ResponseEntity.status(403).body("No perteneces a esta sucursal");
        }

        try{
            servicioService.eliminarServicio(servicio.get());
            return ResponseEntity.ok().body("Se elimino el servicio correctamente");
        }catch (Exception e){
            return ResponseEntity.status(500).body("Hubo un error al eliminar el servicio");
        }
    }

    // ver un endpoint para mostrar servicios x nombre con DTO para todo publico

    @GetMapping("/listar/{idSucursal}")
    public ResponseEntity<?> listarServicios(@PathVariable("idSucursal") Integer idSucursal,
                                             HttpSession sesion){

        if(!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if(!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name()) &&
           !sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
           !sesionService.tieneRol(sesion, ERol.EMPLEADO.name())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        Optional<Sucursal> sucursal = sucursalService.listarSucursalPorId(idSucursal);
        if(sucursal.isEmpty()) return ResponseEntity.status(404).body("No se encontro la sucursal");

        // mirar este mejor a ver si funca bien
        if(!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name()) &&
            !sucursalService.enSucursal((Integer) sesion.getAttribute("userId"),
                    sucursal.get().getId())){
            return ResponseEntity.status(403).body("No perteneces a esta sucursal");
        }

        List<?> servicios;
       try{
        if(sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())){
           servicios = servicioService.listarServiciosPorSucursalAdmin(idSucursal);
        } else{
            // terminar este
            servicios = servicioService.listarServiciosPorSucursal(idSucursal);
        }
            return ResponseEntity.ok().body(servicios);
        }catch(Exception e){
            return ResponseEntity.status(500).body("Hubo un error al listar los servicios");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> listarServiciosPorId(@PathVariable("id") Integer id, HttpSession sesion){

        if(!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if(!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try{
            Optional<Servicio> servicio = servicioService.listarServicioPorId(id);
            return servicio.isPresent() ?
                   ResponseEntity.ok().body(servicio.get())
                 : ResponseEntity.status(404).body("No se encontro el servicio");
        }catch(Exception e){
            return ResponseEntity.status(500).body("Hubo un error al listar los servicios");
        }
    }
}
