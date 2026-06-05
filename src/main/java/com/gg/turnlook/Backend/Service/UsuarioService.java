package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.Usuario.LoginDTO;
import com.gg.turnlook.Backend.DTO.Sucursal.SucursalMiniDTO;
import com.gg.turnlook.Backend.DTO.Usuario.*;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ConflictException;
import com.gg.turnlook.Backend.Excepciones.NotFoundException;
import com.gg.turnlook.Backend.Excepciones.UnauthorizedException;
import com.gg.turnlook.Backend.Model.Imagen;
import com.gg.turnlook.Backend.Model.Rol;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Repository.RolRepository;
import com.gg.turnlook.Backend.Repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usRepo;
    private final RolService rolService;
    private final ImagenService imagenService;
    private final PasswordEncoder passEncoder;

    public UsuarioService(UsuarioRepository usRepo, RolService rolService, ImagenService imagenService, PasswordEncoder passEncoder) {
        this.usRepo = usRepo;
        this.rolService = rolService;
        this.imagenService = imagenService;
        this.passEncoder = passEncoder;
    }


    /// METODOS


    public Usuario inicioSesion(LoginDTO login) {

        Usuario u = usRepo.findByEmailAndActivoTrue(login.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Credenciales incorrectas"));

        if (!passEncoder.matches(login.getPass(), u.getPassword())) {
            throw new UnauthorizedException("Credenciales incorrectas");
        }

        return u;
    }


    public Set<String> setRolesComoString(Usuario u) {
        return u.getRoles().stream()
                .map(r -> r.getRol().name())
                .collect(Collectors.toSet());
    }


    public Usuario crearUsuario(UsuarioCrearDTO u) {

        Rol rol = rolService.listarPorRol(ERol.CLIENTE);

        Usuario user = new Usuario(u.getNombre(), u.getApellido(), u.getEmail(),
                passEncoder.encode(u.getPassword()));

        user.getRoles().add(rol);
        user.setFotoPerfil(imagenService.crearFotoPerfil(u.getFotoUrl()));

        return usRepo.save(user);
    }


    public void eliminarUsuario(Integer id) {
        Usuario u = listarUsuarioPorId(id);
        // usRepo.delete(u);  ver si dejo el delete o el activo -> false
        u.setActivo(false);
        usRepo.save(u);
    }


    public void modificarUsuario(UsuarioModificarDTO usuario, Integer userId) {

        Usuario user = listarUsuarioPorId(userId);

        if (usuario.getNombre() != null && !usuario.getNombre().isBlank()) user.setNombre(usuario.getNombre());

        if (usuario.getApellido() != null && !usuario.getApellido().isBlank()) user.setApellido(usuario.getApellido());

        if (usuario.getEmail() != null && !usuario.getEmail().equals(user.getEmail())) {
            if (usRepo.existsByEmail(usuario.getEmail())) {
                throw new ConflictException("El email ingresado ya esta en uso");
            }
            user.setEmail(usuario.getEmail());
        }

        if (usuario.getPassword() != null) user.setPassword(passEncoder.encode(usuario.getPassword()));

        if (usuario.getFotoUrl() != null && !usuario.getFotoUrl().isBlank()) {
            imagenService.cambiarFotoPerfil(user, usuario.getFotoUrl());
        }

        usRepo.save(user);
    }


    public List<UsuarioMiniAdminDTO> listarUsuarios() {
        return usRepo.findByActivoTrue().stream()
                .map(u -> new UsuarioMiniAdminDTO(
                        u.getId(), u.getNombre(), u.getApellido(), u.isActivo()))
                .toList();
    }

    // ver si despues lo saco
    public List<UsuarioMiniAdminDTO> listarUsuariosEliminados() {
        return usRepo.findByActivoFalse().stream()
                .map(u -> new UsuarioMiniAdminDTO(
                        u.getId(), u.getNombre(), u.getApellido(), u.isActivo()))
                .toList();
    }

    // ver si despues lo saco
    public List<Usuario> filtrarListaUsuarios(String nombre, String apellido, Boolean activo) {
        return usRepo.findAll().stream()
                .filter(u -> nombre == null || u.getNombre().equalsIgnoreCase(nombre))
                .filter(u -> apellido == null || u.getApellido().equalsIgnoreCase(apellido))
                .filter(u -> activo == null || u.isActivo() == activo)
                .toList();
    }


    public UsuarioResponseDTO listarUsuariosPorEmail(UsuarioEmailDTO email) {
        Usuario u = listarUsuarioPorEmail(email.getEmail());

        return new UsuarioResponseDTO(u.getId(), u.getNombre(), u.getApellido()
                , u.getEmail(), u.getFotoPerfil().getFotoValida());
    }


    public Usuario listarUsuarioPorEmail(String email) {
        return usRepo.findByEmailAndActivoTrue(email).
                orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    }


    public Usuario listarUsuarioPorId(Integer id) {
        return usRepo.findById(id).
                orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    }


    public UsuarioPerfilResponseDTO verPerfilPorId(Integer id) {
        return mapearUsuario(id);
    }


    private UsuarioPerfilResponseDTO mapearUsuario(Integer id) {
        Usuario u = listarUsuarioPorId(id);
        UsuarioPerfilResponseDTO uPerfil = new UsuarioPerfilResponseDTO();

        uPerfil.setId(u.getId());
        uPerfil.setNombre(u.getNombre());
        uPerfil.setApellido(u.getApellido());
        uPerfil.setEmail(u.getEmail());
        uPerfil.setFechaCreacion(u.getFechaCreacion());
        uPerfil.setRoles(setRolesComoString(u));
        uPerfil.setFotoPerfil(u.getFotoPerfil().getFotoValida());
        uPerfil.setSucursalesEmpleado(u.getSucursalesEmpleado().stream()
                .map(suc -> new SucursalMiniDTO(suc.getId(), suc.getNombre(),
                        suc.getCategoria().getCategoria())).collect(Collectors.toSet()));

        return uPerfil;
    }


    public void borrarUsuario(Integer usuarioId) {
        Usuario u = listarUsuarioPorId(usuarioId);
        usRepo.delete(u);
    }


    public void solicitudRolEmpleador(Integer userId) {

        Usuario usuario = listarUsuarioPorId(userId);

        // ver q le llegue una noti a un admin para aprobar o no aprobar la solicitud
        // quizas un formulario o algo asi nosE

        Rol empleador = rolService.listarPorRol(ERol.EMPLEADOR);
        usuario.getRoles().add(empleador);
        usRepo.save(usuario);
    }
}

