package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.SucursalCrearDTO;
import com.gg.turnlook.Backend.DTO.SucursalModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

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

    // ver si dsp cambio a spring security para validar sin http sesion manual
    @PostMapping("/crear")
    public ResponseEntity<?> crearSucursal(
            @Valid @RequestBody SucursalCrearDTO sucursal,
            HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        // ver si dsp agrego admin (no creo pq no tiene sentido)
        if (!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            return sucursalService.crearSucursal(sucursal,
                    (Integer) sesion.getAttribute("userId")).isPresent() ?
                    ResponseEntity.ok().body("Se creo la sucursal")
                    : ResponseEntity.status(404).body("No se encontro la categoria deseada");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear la sucursal");
        }
    }

    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarSucursal(@PathVariable("id") Integer id,
                                               @Valid @RequestBody SucursalModificarDTO suc,
                                               HttpSession sesion){

        if(!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if(!sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) &&
           !sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        Optional<Sucursal> sucursal = sucursalService.listarSucursalPorId(id);
        if(sucursal.isEmpty()) return ResponseEntity.status(404).body("No se encontro la sucursal");

        if(!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name()) &&
                !Objects.equals((Integer) sesion.getAttribute("userId"),
                   sucursal.get().getEmpleador().getId())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try{
            return sucursalService.modificarSucursal(suc, sucursal.get()).isPresent() ?
                    ResponseEntity.ok().body("Se modifico la sucursal")
                    : ResponseEntity.status(404).body("No se encontro la categoria deseada");
        }catch(Exception e){
            return ResponseEntity.status(500).body("Error al modificar la sucursal");
        }
    }



    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarSucursal(@PathVariable Integer id, HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, "ADMINISTRADOR")) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            return sucursalService.eliminarSucursal(id) ?
                    ResponseEntity.ok().body("Se elimino la sucursal") :
                    ResponseEntity.status(404).body("No se encontro la sucursal a eliminar");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar la sucursal");
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarSucursales(HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");
        // ver esto del rol con twin
        if (!sesionService.tieneRol(sesion, "ADMINISTRADOR")) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            return ResponseEntity.ok().body(sucursalService.listarSucursales());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar sucursales");
        }
    }

    @GetMapping("/listar/filtrar")
    public ResponseEntity<?> filtrarListaSucursales(@RequestParam(required = false) String nombre,
                                                    @RequestParam(required = false) Boolean activo,
                                                    @RequestParam(required = false) Integer catId,
                                                    @RequestParam(required = false) Integer userId,
                                                    HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, "ADMINISTRADOR")) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }
       try{
           List<Sucursal> sucursales = sucursalService.filtrarListaSucursales(nombre, activo, catId, userId);
           return !sucursales.isEmpty() ?
                   ResponseEntity.ok().body(sucursales)
                   : ResponseEntity.status(404).body("No se encontraron sucursales");
       }catch(Exception e){
           return ResponseEntity.status(500).body("Error al filtrar sucursales");
       }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> sucursalPorId(@PathVariable Integer id, HttpSession sesion){

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, "ADMINISTRADOR")) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }
       try{
           Optional<Sucursal> sucursal = sucursalService.listarSucursalPorId(id);
           return sucursal.isPresent() ?
                  ResponseEntity.ok().body(sucursal.get())
                  : ResponseEntity.status(404).body("No se encontro la sucursal");
       }catch (Exception e){
           return ResponseEntity.status(500).body("Error al filtrar sucursales");
       }
    }


}