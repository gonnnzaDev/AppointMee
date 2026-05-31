package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.Servicio.ServicioCrearDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioMiniDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioModificarDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioMostrarDTO;
import com.gg.turnlook.Backend.Excepciones.BadRequestException;
import com.gg.turnlook.Backend.Excepciones.ConflictException;
import com.gg.turnlook.Backend.Excepciones.NotFoundException;
import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Repository.ServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ServicioService {

    private final ServicioRepository servRepo;
    private final SucursalService sucService;

    public ServicioService(ServicioRepository servRepo, SucursalService sucService) {
        this.servRepo = servRepo;
        this.sucService = sucService;
    }


    public void crearServicio(ServicioCrearDTO servicio) {

        if(servicio.getDuracion() % 30 != 0){
            throw new BadRequestException("La duracion tiene que ser en intervalos de 30 minutos");
        }

        Sucursal sucursal = sucService.listarSucursalPorId(servicio.getSucursalId());
        Servicio serv = new Servicio(
                servicio.getNombre(), servicio.getDescripcion(), servicio.getDuracion(),
                servicio.getPrecio(), sucursal
        );
        servRepo.save(serv);
    }


    public void modificarServicio(ServicioModificarDTO servicio, Servicio servOld) {

        if (servicio.getNombre() != null) servOld.setNombre(servicio.getNombre());
        if (servicio.getDescripcion() != null) servOld.setDescripcion(servicio.getDescripcion());
        if (servicio.getDuracion() != null) servOld.setDuracion(servicio.getDuracion());
        if (servicio.getPrecio() != null) servOld.setPrecio(servicio.getPrecio());

        if(servOld.getDuracion() % 30 != 0){
            throw new BadRequestException("La duracion tiene que ser en intervalos de 30 minutos");
        }

        servRepo.save(servOld);
    }


    public void eliminarServicio(Servicio servicio) {
        servicio.setActivo(false);
        servRepo.save(servicio);
    }


    // ESTE seria para admin dsp ver (sacar seguramente)
    public List<Servicio> listarServicios() {
        return servRepo.findByActivoTrue();
    }


    public List<ServicioMiniDTO> listarServiciosSucursal(Integer sucursalId){
        sucService.listarSucursalPorId(sucursalId);  //validacion
        return servRepo.findBySucursalId(sucursalId).stream()
                .map(s -> new ServicioMiniDTO(s.getId(), s.getNombre(),
                        s.getDuracion()))
                .toList();
    }


    public ServicioMostrarDTO verServicioPorId(Integer idServicio) {
        return mapearServicio(listarServicioPorId(idServicio));
    }


    public ServicioMostrarDTO mapearServicio(Servicio s) {
        ServicioMostrarDTO dto = new ServicioMostrarDTO();

        dto.setId(s.getId());
        dto.setNombre(s.getNombre());
        dto.setDescripcion(s.getDescripcion());
        dto.setDuracion(s.getDuracion());
        dto.setPrecio(s.getPrecio());

        dto.setNombreSucursal(s.getSucursal().getNombre());
        dto.setDireccionSucursal(s.getSucursal().getDireccion());
        dto.setCategoriaSucursal(s.getSucursal().getCategoria().getCategoria());

        return dto;
    }


    public Servicio listarServicioPorId(Integer servicioId) {
        return servRepo.findById(servicioId).
                orElseThrow(() -> new NotFoundException("Servicio no encontrado"));
    }
}
