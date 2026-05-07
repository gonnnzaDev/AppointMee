package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.SucursalCrearDTO;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Repository.SucursalRepository;
import org.springframework.stereotype.Service;

@Service
public class SucursalService {

    private final SucursalRepository sucRepo;

    public SucursalService(SucursalRepository sucRepo) {
        this.sucRepo = sucRepo;
    }


    /// METODOS

    public Sucursal crearSucursal(SucursalCrearDTO sucursal){
      /*  Sucursal suc = new Sucursal(sucursal.getNombre(), sucursal.getDireccion(),
                sucursal.getTelefono(), sucursal.getDescripcion(),
                sucursal.getCategoria())   */
        return new Sucursal();
    }
}
