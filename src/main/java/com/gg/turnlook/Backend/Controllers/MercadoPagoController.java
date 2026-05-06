package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.PagoDTO;
import com.gg.turnlook.Backend.Service.MercadoPagoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/pagos")
public class MercadoPagoController {

    private final MercadoPagoService mpService;

    public MercadoPagoController(MercadoPagoService mpService) {
        this.mpService = mpService;
    }


    /// ENDPOINTS

   /* @PostMapping("/preferencia")
    public ResponseEntity<?> realizarPago(@RequestBody PagoDTO pagoDTO){
                               
    }
            lo termino cuando tengo la clase hecha
    */
}
