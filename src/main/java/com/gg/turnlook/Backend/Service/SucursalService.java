package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.Sucursal.SucursalCrearDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalModificarDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalMostrarDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmpleadorResponseDTO;
import com.gg.turnlook.Backend.Excepciones.ConflictException;
import com.gg.turnlook.Backend.Excepciones.NotFoundException;
import com.gg.turnlook.Backend.Model.Categoria;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Repository.CategoriaRepository;
import com.gg.turnlook.Backend.Repository.SucursalRepository;
import com.gg.turnlook.Backend.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SucursalService {

    private final SucursalRepository sucRepo;
    private final CategoriaRepository catRepo;
    private final UsuarioRepository userRepo;
    private final UsuarioService usuarioService;

    public SucursalService(SucursalRepository sucRepo, CategoriaRepository catRepo, UsuarioRepository userRepo, UsuarioService usuarioService) {
        this.sucRepo = sucRepo;
        this.catRepo = catRepo;
        this.userRepo = userRepo;
        this.usuarioService = usuarioService;
    }


    /// METODOS

    public boolean enSucursal(Integer idUsuario, Integer idSucursal) {
        Optional<Sucursal> sucursal = sucRepo.findById(idSucursal);
        if (sucursal.isEmpty()) return false;
        Optional<Usuario> usuario = userRepo.findById(idUsuario);
        if (usuario.isEmpty()) return false;

        return sucursal.get().getEmpleados().contains(usuario.get()) ||
                sucursal.get().getEmpleador().equals(usuario.get());
    }

    public void crearSucursal(SucursalCrearDTO sucursal, Integer userId) {

        Categoria cat = catRepo.findById(sucursal.getCategoriaId()).
                orElseThrow(() -> new NotFoundException("No se encontró la categoria"));

        Usuario empleador = usuarioService.listarUsuarioPorId(userId);
        Sucursal suc = new Sucursal(sucursal.getNombre(), sucursal.getDireccion(),
                sucursal.getTelefono(), sucursal.getDescripcion(),
                cat, empleador);

        sucRepo.save(suc);
    }

    public void modificarSucursal(SucursalModificarDTO sucursal, Sucursal suc) {

        if (sucursal.getCategoriaId() != null) {
            Categoria cat = catRepo.findById(sucursal.getCategoriaId()).
                    orElseThrow(() -> new NotFoundException("No se encontró la categoria"));
            suc.setCategoria(cat);
        }
        if (sucursal.getNombre() != null) suc.setNombre(sucursal.getNombre());
        if (sucursal.getDireccion() != null &&
                !sucursal.getDireccion().equalsIgnoreCase(suc.getDireccion())) {
            if (sucRepo.existsByDireccionIgnoreCase(sucursal.getDireccion())) {
                throw new ConflictException("La direccion ingresada ya existe");
            }
            suc.setDireccion(sucursal.getDireccion());
        }
        if (sucursal.getTelefono() != null) suc.setTelefono(sucursal.getTelefono());
        if (sucursal.getDescripcion() != null) suc.setDescripcion(sucursal.getDescripcion());

        sucRepo.save(suc);
    }

    public void eliminarSucursal(Integer id) {
        Sucursal sucursal = listarSucursalPorId(id);
        //sucRepo.delete(sucursal.get());  ver si dejo este o el de activo -> false
        sucursal.setActivo(false);
        sucRepo.save(sucursal);
    }

    public List<Sucursal> listarSucursales() {
        return sucRepo.findByActivoTrue();
    }

    public List<SucursalMostrarDTO> listarSucursalesPropias(Integer userId) {
        List<Sucursal> sucursales = sucRepo.findByEmpleadorIdAndActivoTrue(userId);
        return mapearSucursales(sucursales);
    }

    public SucursalMostrarDTO mapearSucursal(Sucursal suc) {
        SucursalMostrarDTO dto = new SucursalMostrarDTO();
        dto.setNombre(suc.getNombre());
        dto.setDireccion(suc.getDireccion());
        dto.setTelefono(suc.getTelefono());
        dto.setDescripcion(suc.getDescripcion());
        dto.setFechaCreacion(suc.getFechaCreacion());
        dto.setCategoria(suc.getCategoria().getCategoria());

        UsuarioEmpleadorResponseDTO empleador = new UsuarioEmpleadorResponseDTO(
                suc.getEmpleador().getNombre(),
                suc.getEmpleador().getApellido(),
                suc.getEmpleador().getEmail()
        );
        dto.setEmpleador(empleador);

        Set<UsuarioEmpleadorResponseDTO> empleadosDTO = suc.getEmpleados()
                .stream()
                .map(u -> new UsuarioEmpleadorResponseDTO(
                        u.getNombre(),
                        u.getApellido(),
                        u.getEmail()
                ))
                .collect(Collectors.toSet());
        dto.setEmpleados(empleadosDTO);

        return dto;
    }

    public List<SucursalMostrarDTO> mapearSucursales(List<Sucursal> sucursales){
        List<SucursalMostrarDTO> sucursalesDTO = new ArrayList<>();
        return sucursales.stream()
                .map(suc -> mapearSucursal(suc))
                .toList();
    }

    public List<Sucursal> filtrarListaSucursales(String nombre, Boolean activo,
                                                 Integer catId, Integer userId) {

        return sucRepo.findAll().stream().
                filter(s -> nombre == null || s.getNombre().equalsIgnoreCase(nombre)).
                filter(s -> activo == null || s.isActivo() == activo).
                filter(s -> catId == null || s.getCategoria().getId() == catId).
                filter(s -> userId == null || s.getEmpleador().getId() == userId).
                toList();
    }

    public Sucursal listarSucursalPorId(Integer id) {
        return sucRepo.findById(id).
                orElseThrow(() -> new NotFoundException("No se encontró la sucursal"));
    }
}
