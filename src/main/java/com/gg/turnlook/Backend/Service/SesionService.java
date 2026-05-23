package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.Excepciones.UnauthorizedException;
import com.gg.turnlook.Backend.Model.Usuario;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class SesionService {

    private final UsuarioService usuarioService;

    public SesionService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    public Integer getUsuarioId(HttpSession sesion) {
        return (Integer) sesion.getAttribute("userId");
    }

    public void isLogged(HttpSession sesion){
        if (getUsuarioId(sesion) == null) throw new UnauthorizedException("No estas logeado");
    }

    public Usuario getUsuarioLogged(HttpSession sesion) {
        isLogged(sesion);
        return usuarioService.listarUsuarioPorId(getUsuarioId(sesion));
    }

    public boolean tieneRol(HttpSession sesion, String rol) {
        Set<String> roles = (Set<String>) sesion.getAttribute("userRoles");
        return roles != null && roles.contains(rol);
    }
}
