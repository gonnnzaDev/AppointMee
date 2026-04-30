package com.gg.turnlook.Service;

import com.gg.turnlook.Model.Rol;
import com.gg.turnlook.Model.Usuario;
import com.gg.turnlook.Repository.RolRepository;
import com.gg.turnlook.Repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Usuario crearUsuario(Usuario u) {
        Optional<Rol> rol = rolRepo.findByNombre("CLIENTE");
        if(rol.isEmpty()){
            throw new RuntimeException("El rol no existe");
        }
        u.setPassword(passEncoder.encode(u.getPassword()));
        u.getRoles().add(rol.get());
        return usRepo.save(u);
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
            return user;
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
                .filter(u -> activo == null || u.isActivo() == activo).toList();
    }

    public Optional<Usuario> listarUsuariosPorEmail(String email){
        return usRepo.findByEmail(email);
    }

    public Optional<Usuario> listarUsuarioPorId(Integer id){
        return usRepo.findById(id);
    }
}
