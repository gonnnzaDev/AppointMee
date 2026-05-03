package com.gg.turnlook.Backend.Service;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class SesionService {

        public Integer getUsuarioId (HttpSession sesion){
            return (Integer) sesion.getAttribute("userId");
        }

        public boolean isLogged (HttpSession sesion){
            return getUsuarioId(sesion) != null;
        }

        public boolean tieneRol (HttpSession sesion, String rol){
            Set<String> roles = (Set<String>) sesion.getAttribute("userRoles");
            return roles != null && roles.contains(rol);
        }
}
