package com.gg.turnlook.Backend.Controllers;


import com.gg.turnlook.Backend.Service.MercadoPagoService;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/pagos")
public class MercadoPagoController {



    private final MercadoPagoService mpService;


    public MercadoPagoController(MercadoPagoService mpService) {
        this.mpService = mpService;
    }


    /// ENDPOINTS


    @PostMapping("/preferencia/{turnoId}")
    public ResponseEntity<?> realizarPago(@PathVariable("turnoId") Integer turnoId,
                                          HttpSession sesion) throws MPException, MPApiException {
      try {
          return ResponseEntity.ok().body(mpService.pagar(turnoId));
      }catch (MPException e1){
          return ResponseEntity.status(500).body("Error mp1");  // test
      }catch (MPApiException e2){
          return ResponseEntity.status(500).body("Error mp2");  // test
      }
    }


}
