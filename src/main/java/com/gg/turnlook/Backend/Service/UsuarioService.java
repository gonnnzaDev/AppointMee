package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.LoginDTO;
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

            if(login.getEmail() == null || login.getEmail().isBlank() ||
               login.getPass() == null || login.getPass().isBlank()){
                return Optional.empty();
            }

            Optional<Usuario> u = usRepo.findByEmail(login.getEmail());

            if(u.isEmpty()) return u;

            if(!passEncoder.matches(login.getPass(), u.get().getPassword())) return Optional.empty();

            return u;
    }

    public Set<String> setRolesComoString(Usuario u){
        return u.getRoles().stream()
                .map(r -> r.getNombre())
                .collect(Collectors.toSet());
    }

    public Usuario crearUsuario(UsuarioCrearDTO u) {
        Optional<Rol> rol = rolRepo.findByNombre("CLIENTE");
        if(rol.isEmpty()) throw new RuntimeException("El rol no existe");

        Usuario user = new Usuario(u.getNombre(),u.getApellido(),u.getEmail(),
                                   passEncoder.encode(u.getPassword()));
        user.getRoles().add(rol.get());
        return usRepo.save(user);
    }

    public boolean eliminarUsuario(Integer id){
        Optional<Usuario> u = usRepo.findById(id);
        if(u.isEmpty()){
            return false;
        }
        usRepo.delete(u.get());
        return true;
    }

    public Optional<Usuario> modificarUsuario(Integer id, Usuario u){
        Optional<Usuario> user = listarUsuarioPorId(id);
        if (user.isEmpty()) {
            return Optional.empty();
        }
        if (u.getNombre() != null) user.get().setNombre(u.getNombre());
        if (u.getApellido() != null) user.get().setApellido(u.getApellido());
        if (u.getEmail() != null) user.get().setEmail(u.getEmail());
        if (u.getPassword() != null) user.get().setPassword(passEncoder.encode(u.getPassword()));
        usRepo.save(user.get());
        return user;
    }

    public List<Usuario> listarUsuarios(){
        return usRepo.findAll();
    }

    public List<Usuario> filtrarListaUsuarios(String nombre, String apellido, Boolean activo){
        List<Usuario> filtro = listarUsuarios();
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
