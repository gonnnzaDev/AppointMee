package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.ServicioCrearDTO;
import com.gg.turnlook.Backend.DTO.ServicioModificarDTO;
import com.gg.turnlook.Backend.DTO.ServicioMostrarDTO;
import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Repository.ServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ServicioService {

    private final ServicioRepository servRepo;
    private final SucursalService sucService;

    public ServicioService(ServicioRepository servRepo, SucursalService sucService) {
        this.servRepo = servRepo;
        this.sucService = sucService;
    }


    public void crearServicio(ServicioCrearDTO servicio){
        Sucursal sucursal = sucService.listarSucursalPorId(servicio.getSucursalId()).get();
        Servicio serv = new Servicio(
                servicio.getNombre(), servicio.getDescripcion(), servicio.getDuracion(),
                servicio.getPrecio(), sucursal
        );                           // NO hace falta present en el opt pq el controller ya valida
        servRepo.save(serv);
    }

    public Optional<Servicio> modificarServicio(ServicioModificarDTO servicio, Integer servicioId){
        Optional<Servicio> servOld = servRepo.findById(servicioId);
        if(servOld.isEmpty()) return Optional.empty();

        if(!Objects.equals(servOld.get().getSucursal().getId(), servicio.getSucursalId())) {
            return Optional.empty();
        }

        if(servicio.getNombre() != null) servOld.get().setNombre(servicio.getNombre());
        if(servicio.getDescripcion() != null) servOld.get().setDescripcion(servicio.getDescripcion());
        if(servicio.getDuracion() != null) servOld.get().setDuracion(servicio.getDuracion());
        if(servicio.getPrecio() != null) servOld.get().setPrecio(servicio.getPrecio());

        return Optional.of(servRepo.save(servOld.get()));
    }

    public void eliminarServicio(Servicio servicio){
        servicio.setActivo(false);
        servRepo.save(servicio);
    }

    // ESTE seria para admin dsp ver
    public List<Servicio> listarServicios(){
        return servRepo.findByActivoTrue();
    }

    // ver lo de activo = false despues
    public List<Servicio> listarServiciosPorSucursalAdmin(Integer idSucursal){
        return servRepo.findBySucursalId(idSucursal);
    }

    public List<ServicioMostrarDTO> listarServiciosPorSucursal(Integer idSucursal){
        return null;  // terminar
    }

    public Optional<Servicio> listarServicioPorId(Integer servicioId){
        return servRepo.findById(servicioId);
    }
}
