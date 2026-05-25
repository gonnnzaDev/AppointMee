package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.Servicio.ServicioCrearDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioModificarDTO;
import com.gg.turnlook.Backend.DTO.Servicio.ServicioMostrarDTO;
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
        Sucursal sucursal = sucService.listarSucursalPorId(servicio.getSucursalId());
        Servicio serv = new Servicio(
                servicio.getNombre(), servicio.getDescripcion(), servicio.getDuracion(),
                servicio.getPrecio(), sucursal
        );
        servRepo.save(serv);
    }

    public void modificarServicio(ServicioModificarDTO servicio, Integer servicioId) {

        Servicio servOld = listarServicioPorId(servicioId);

        if (!Objects.equals(servOld.getSucursal().getId(), servicio.getSucursalId())) {
            throw new ConflictException("No se puede cambiar la sucursal del servicio");
        }

        if (servicio.getNombre() != null) servOld.setNombre(servicio.getNombre());
        if (servicio.getDescripcion() != null) servOld.setDescripcion(servicio.getDescripcion());
        if (servicio.getDuracion() != null) servOld.setDuracion(servicio.getDuracion());
        if (servicio.getPrecio() != null) servOld.setPrecio(servicio.getPrecio());

        servRepo.save(servOld);
    }

    public void eliminarServicio(Servicio servicio) {
        servicio.setActivo(false);
        servRepo.save(servicio);
    }

    // ESTE seria para admin dsp ver
    public List<Servicio> listarServicios() {
        return servRepo.findByActivoTrue();
    }

    // ver lo de activo = false despues
    public List<Servicio> listarServiciosPorSucursalAdmin(Integer idSucursal) {
        return servRepo.findBySucursalId(idSucursal);
    }

    public List<ServicioMostrarDTO> listarServiciosPorSucursalPropia(Integer idSucursal) {
        List<Servicio> servicios = listarServiciosPorSucursalAdmin(idSucursal);
        return mapearServicios(servicios);
    }

    public ServicioMostrarDTO mapearServicio(Servicio s) {
        ServicioMostrarDTO dto = new ServicioMostrarDTO();

        dto.setNombre(s.getNombre());
        dto.setDescripcion(s.getDescripcion());
        dto.setDuracion(s.getDuracion());
        dto.setPrecio(s.getPrecio());

        dto.setNombreSucursal(s.getSucursal().getNombre());
        dto.setDireccionSucursal(s.getSucursal().getDireccion());
        dto.setCategoriaSucursal(s.getSucursal().getCategoria().getCategoria());

        return dto;
    }

    public List<ServicioMostrarDTO> mapearServicios(List<Servicio> servicios) {
        return servicios.stream()
                .map(serv -> mapearServicio(serv))
                .toList();
    }

    public Servicio listarServicioPorId(Integer servicioId) {
        return servRepo.findById(servicioId).
                orElseThrow(() -> new NotFoundException("Servicio no encontrado"));
    }
}
