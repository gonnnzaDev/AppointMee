package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.Service.SucursalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sucursal")
public class SucursalController {

    private final SucursalService sucursalService;

    public SucursalController(SucursalService sucursalService) {
        this.sucursalService = sucursalService;
    }


    /// ENDPOINTS


    //@PostMapping("/crear")
    //public ResponseEntity<?> crearSucursal()
}
