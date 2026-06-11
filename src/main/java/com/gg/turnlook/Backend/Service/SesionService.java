package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.Model.Usuario;
import org.springframework.stereotype.Service;

import java.util.Set;



@Service
public class SesionService {

    private final UsuarioService usuarioService;


    public SesionService(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }



    /// VER SI LO SACO AL CARAJO Y LO METO EN USUARIO SERVICE (LO MAS PROBABLE)🫎

    public boolean tieneRol(Usuario usuario, String rol) {
        Set<String> roles = usuarioService.setRolesComoString(usuario);
        return roles != null && roles.contains(rol);
    }
}
