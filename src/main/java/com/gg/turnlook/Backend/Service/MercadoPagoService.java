package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.PagoDTO;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    public String pagar(PagoDTO pagoDTO) throws MPException, MPApiException {

        // aca iria el token del local (despues lo hago)

        PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title(pagoDTO.getTitulo())
                .description(pagoDTO.getDescripcion())
                .quantity(pagoDTO.getCantidad())
                .currencyId("ARS")
                .unitPrice(pagoDTO.getPrecio())
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
