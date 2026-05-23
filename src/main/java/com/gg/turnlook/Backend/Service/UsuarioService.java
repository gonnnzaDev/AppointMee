package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.LoginDTO;
import com.gg.turnlook.Backend.DTO.UsuarioModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.NotFoundException;
import com.gg.turnlook.Backend.Model.Rol;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Repository.RolRepository;
import com.gg.turnlook.Backend.Repository.UsuarioRepository;
import com.gg.turnlook.Backend.DTO.UsuarioCrearDTO;
import com.gg.turnlook.Backend.DTO.UsuarioMostrarDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usRepo;
    private final RolRepository rolRepo;
    private final PasswordEncoder passEncoder;

    public UsuarioService(UsuarioRepository usRepo,RolRepository rolRepo, PasswordEncoder passEncoder) {
        this.usRepo = usRepo;
        this.rolRepo = rolRepo;
        this.passEncoder = passEncoder;
    }


    public Optional<Usuario> inicioSesion(LoginDTO login){

            Optional<Usuario> u = usRepo.findByEmail(login.getEmail());

            if(u.isEmpty()) return u;

            if(!passEncoder.matches(login.getPass(), u.get().getPassword())) return Optional.empty();

            return u;
    }

    public Set<String> setRolesComoString(Usuario u){
        return u.getRoles().stream()
                .map(r -> r.getRol().name())
                .collect(Collectors.toSet());
    }

    public Usuario crearUsuario(UsuarioCrearDTO u) {
        Rol rol = rolRepo.findByRol(ERol.CLIENTE)
                .orElseThrow(() -> new NotFoundException("Rol no encontrado"));

        Usuario user = new Usuario(u.getNombre(),u.getApellido(),u.getEmail(),
                                   passEncoder.encode(u.getPassword()));
        user.getRoles().add(rol);
        return usRepo.save(user);
    }

    public boolean eliminarUsuario(Integer id){
        Optional<Usuario> u = usRepo.findById(id);
        if(u.isEmpty()) return false;
        // usRepo.delete(u.get());  ver si dejo el delete o el activo -> false
        u.get().setActivo(false);
        usRepo.save(u.get());
        return true;
    }

    public void modificarUsuario(UsuarioModificarDTO usuario, Usuario user){

        if (usuario.getNombre() != null) user.setNombre(usuario.getNombre());
        if (usuario.getApellido() != null) user.setApellido(usuario.getApellido());
        if (usuario.getEmail() != null) user.setEmail(usuario.getEmail());
        if (usuario.getPassword() != null) user.setPassword(passEncoder.encode(usuario.getPassword()));

        usRepo.save(user);
    }

    public List<Usuario> listarUsuarios(){
        return usRepo.findByActivoTrue();
    }

    public List<Usuario> filtrarListaUsuarios(String nombre, String apellido, Boolean activo){
        List<Usuario> filtro = usRepo.findAll();
        return filtro.stream()
                .filter(u -> nombre == null || u.getNombre().equalsIgnoreCase(nombre))
                .filter(u -> apellido == null || u.getApellido().equalsIgnoreCase(apellido))
                .filter(u -> activo == null || u.isActivo() == activo)
                .toList();
    }

    public Optional<Usuario> listarUsuariosPorEmailAdmin(String email){
        return usRepo.findByEmail(email);
    }

    public Optional<UsuarioMostrarDTO> listarUsuariosPorEmailEmpleador(String email){
        Optional<Usuario> aux =  usRepo.findByEmail(email);
        if(aux.isEmpty()) return Optional.empty();

        UsuarioMostrarDTO u =  new UsuarioMostrarDTO(aux.get().getNombre(), aux.get().getApellido(),
                                                     aux.get().getEmail());
        return Optional.of(u);
    }

    public Optional<Usuario> listarUsuarioPorId(Integer id){
        return usRepo.findById(id);
    }
}
