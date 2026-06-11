package com.gg.turnlook.Backend.Service;



import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Turno;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;



@Service
public class MercadoPagoService {



    private final TurnoService turnoService;

    // mp test
    @Value("${mercadopago.access-token}")
    private String tokenMp;



    public MercadoPagoService(TurnoService turnoService) {
        this.turnoService = turnoService;
    }



    /// METODOS


    public String pagar(Integer turnoId) throws MPException, MPApiException {

        MercadoPagoConfig.setAccessToken(tokenMp);

        Turno turno = turnoService.listarTurnoPorId(turnoId);
        Servicio servicio = turno.getServicio();

        PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title(servicio.getNombre())
                .description(servicio.getDescripcion())
                .quantity(1)
                .currencyId("ARS")
                .unitPrice(servicio.getPrecio())
                .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        items.add(item);

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items).build();

        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        return preference.getInitPoint();
    }
}
