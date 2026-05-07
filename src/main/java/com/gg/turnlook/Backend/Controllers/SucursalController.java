package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.SucursalCrearDTO;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.SucursalService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sucursal")
public class SucursalController {

    private final SucursalService sucursalService;
    private final UsuarioService usuarioService;
    private final SesionService sesionService;

    public SucursalController(SucursalService sucursalService, UsuarioService usuarioService, SesionService sesionService) {
        this.sucursalService = sucursalService;
        this.usuarioService = usuarioService;
        this.sesionService = sesionService;
    }


    /// ENDPOINTS

// ver si dsp cambio a spring security para validar sin http sesion manual

    @PostMapping("/crear")
    public ResponseEntity<?> crearSucursal(
            @Valid @RequestBody SucursalCrearDTO sucursal,
            HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, "EMPLEADOR")
                || !sesionService.tieneRol(sesion, "ADMINISTRADOR")) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

    return ResponseEntity.ok().body("");
    }


}