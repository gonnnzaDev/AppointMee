package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.Imagen.ImagenDTO;
import com.gg.turnlook.Backend.DTO.Imagen.ImagenResponseDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalCrearDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalMiniDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalModificarDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalResponseDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioMiniAdminDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmailDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioResponseDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioMiniDTO;
import com.gg.turnlook.Backend.Excepciones.BadRequestException;
import com.gg.turnlook.Backend.Excepciones.ConflictException;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Excepciones.NotFoundException;
import com.gg.turnlook.Backend.Model.Categoria;
import com.gg.turnlook.Backend.Model.Imagen;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Repository.CategoriaRepository;
import com.gg.turnlook.Backend.Repository.SucursalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;



@Service
public class SucursalService {



    private final SucursalRepository sucRepo;
    private final CategoriaRepository catRepo;
    private final UsuarioService usuarioService;
    private final ImagenService imagenService;



    public SucursalService(SucursalRepository sucRepo, CategoriaRepository catRepo, UsuarioService usuarioService, ImagenService imagenService) {
        this.sucRepo = sucRepo;
        this.catRepo = catRepo;
        this.usuarioService = usuarioService;
        this.imagenService = imagenService;
    }



    /// METODOS



    public boolean enSucursal(Integer idUsuario, Integer idSucursal) {

        Sucursal sucursal;
        Usuario usuario;
        try {
            sucursal = listarSucursalPorId(idSucursal);
            usuario = usuarioService.listarUsuarioPorId(idUsuario);
        } catch (NotFoundException e) {
            return false;
        }

        return sucursal.getEmpleador().getId().equals(usuario.getId()) ||
                sucursal.getEmpleados().stream()
                        .anyMatch(u -> u.getId().equals(usuario.getId()));
    }


    public void crearSucursal(SucursalCrearDTO sucursal, Integer userId) {

        if (!sucursal.getHoraCierre().isAfter(sucursal.getHoraApertura())) {
            throw new BadRequestException("El horario de cierre tiene que ser posterior al de apertura");
        }

        if(sucRepo.existsByDireccionIgnoreCase(sucursal.getDireccion())){
            throw new ConflictException("La direccion ingresada ya existe");
        }

        Categoria cat = catRepo.findById(sucursal.getCategoriaId()).
                orElseThrow(() -> new NotFoundException("No se encontró la categoria"));

        Usuario empleador = usuarioService.listarUsuarioPorId(userId);

        Sucursal suc = new Sucursal(sucursal.getNombre(), sucursal.getDireccion(),
                sucursal.getTelefono(), sucursal.getDescripcion(),
                sucursal.getHoraApertura(), sucursal.getHoraCierre(),
                cat, empleador);

        suc.setFotoPerfil(imagenService.crearFotoPerfil(sucursal.getFotoUrl()));

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

        if (sucursal.getHoraApertura() != null) suc.setHoraApertura(sucursal.getHoraApertura());

        if (sucursal.getHoraCierre() != null) suc.setHoraCierre(sucursal.getHoraCierre());

        if (!suc.getHoraCierre().isAfter(suc.getHoraApertura())) {
            throw new BadRequestException("El horario de cierre tiene que ser posterior al de apertura");
        }

        // ver si valida bien como ultimo dsp
        if (sucursal.getFotoUrl() != null && !sucursal.getFotoUrl().isBlank()){
            imagenService.cambiarFotoPerfilSucursal(suc, sucursal.getFotoUrl());
        }

        sucRepo.save(suc);
    }


    public List<ImagenResponseDTO> listarImagenesPorSucursal(Sucursal suc){

        return imagenService.listarImagenesPorSucursal(suc);
    }


    public void agregarImagenes(ImagenDTO imagenes, Sucursal sucursal){

        long totalImagenes = imagenService.cuantasImagenesPorSucursal(sucursal);

        if(imagenes.getUrls().size() + totalImagenes > 5){
            throw new ConflictException("Una sucursal no puede tener mas de 5 imagenes");
        }

        for(String imagen : imagenes.getUrls()){

            imagenService.crearImagenSucursal(sucursal, imagen);
        }

    }


    public void eliminarImagen(Integer imagenId, Sucursal suc){

        Imagen img = imagenService.listarImagenPorId(imagenId);

        if(!Objects.equals(img.getSucursal().getId(), suc.getId())){
            throw new ForbiddenException("La imagen no le corresponde a esta sucursal");
        }
        
        imagenService.eliminarImagen(img);
    }


    public void eliminarSucursal(Integer id) {
        Sucursal sucursal = listarSucursalPorId(id);
        //sucRepo.delete(sucursal.get());  ver si dejo este o el de activo -> false
        sucursal.setActivo(false);
        sucRepo.save(sucursal);
    }


    public List<SucursalMiniDTO> listarSucursales() {
        return sucRepo.findByActivoTrue().stream()
                .map(suc -> new SucursalMiniDTO(suc.getId(), suc.getNombre(),
                        suc.getCategoria().getCategoria().name(),
                        suc.getFotoPerfil().getFotoValida()))
                .toList();
    }


    // ver si hago endpoint para listar sucursales eliminadas (no creo)


    public SucursalResponseDTO verSucursalPorId(Integer id) {
        Sucursal sucursal = listarSucursalPorId(id);
        return mapearSucursal(sucursal);
    }


    private SucursalResponseDTO mapearSucursal(Sucursal suc) {
        SucursalResponseDTO dto = new SucursalResponseDTO();
        dto.setNombre(suc.getNombre());
        dto.setDireccion(suc.getDireccion());
        dto.setTelefono(suc.getTelefono());
        dto.setDescripcion(suc.getDescripcion());
        dto.setFechaCreacion(suc.getFechaCreacion());
        dto.setCategoria(suc.getCategoria().getCategoria().name());
        dto.setHoraApertura(suc.getHoraApertura());
        dto.setHoraCierre(suc.getHoraCierre());
        dto.setFotoPerfil(suc.getFotoPerfil().getFotoValida());

        UsuarioMiniDTO empleador = new UsuarioMiniDTO(
                suc.getEmpleador().getNombre(),
                suc.getEmpleador().getApellido()
        );
        dto.setEmpleador(empleador);

        Set<UsuarioMiniDTO> empleadosDTO = suc.getEmpleados()
                .stream()
                .map(u -> new UsuarioMiniDTO(
                        u.getNombre(),
                        u.getApellido()
                ))
                .collect(Collectors.toSet());
        dto.setEmpleados(empleadosDTO);

        return dto;
    }


    public List<SucursalMiniDTO> filtrarListaSucursales(Integer catId, String nombre) {

        List<Sucursal> sucursales;

        boolean tieneNombre = nombre != null && !nombre.isBlank();

        if (catId != null && tieneNombre) {
            sucursales = sucRepo.findByNombreContainingIgnoreCaseAndCategoriaIdAndActivoTrue(nombre, catId);
        } else if (catId == null && tieneNombre) {
            sucursales = sucRepo.findByNombreContainingIgnoreCaseAndActivoTrue(nombre);
        } else if (catId != null) {
            sucursales = sucRepo.findByCategoriaIdAndActivoTrue(catId);
        } else {
            return listarSucursales();
        }

        return sucursales.stream().map(s -> new SucursalMiniDTO(
                        s.getId(), s.getNombre(), s.getCategoria().getCategoria().name(),
                        s.getFotoPerfil().getFotoValida()))
                .toList();
    }


    public Sucursal listarSucursalPorId(Integer id) {
        return sucRepo.findById(id).
                orElseThrow(() -> new NotFoundException("No se encontró la sucursal"));
    }


    public Set<UsuarioMiniAdminDTO> verEmpleadosAdmin(Integer sucursalId) {
        Sucursal suc = listarSucursalPorId(sucursalId);
        return suc.getEmpleados().stream().
                map(u -> new UsuarioMiniAdminDTO(u.getId(),
                        u.getNombre(), u.getApellido(), u.isActivo()))
                .collect(Collectors.toSet());
    }


    // est
    public Set<UsuarioResponseDTO> verEmpleadosEmpleador(Integer sucursalId) {
        Sucursal suc = listarSucursalPorId(sucursalId);
        return suc.getEmpleados().stream().
                map(u -> new UsuarioResponseDTO(u.getId(), u.getNombre(),
                        u.getApellido(), u.getEmail(), u.getFotoPerfil().getFotoValida()))
                .collect(Collectors.toSet());
    }


    public void agregarEmpleado(Sucursal sucursal, UsuarioEmailDTO userEmail) {

        Usuario usuario = usuarioService.listarUsuarioPorEmail(userEmail.getEmail());
        sucursal.getEmpleados().add(usuario);  // dsp ver lo de notificaciones
        sucRepo.save(sucursal);
    }


    public void eliminarEmpleado(Sucursal sucursal, Integer userId) {

        Usuario usuario = usuarioService.listarUsuarioPorId(userId);
        sucursal.getEmpleados().remove(usuario);   // dsp ver lo de notificacion
        sucRepo.save(sucursal);
    }
}
