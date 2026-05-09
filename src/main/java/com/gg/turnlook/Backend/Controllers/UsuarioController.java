package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.LoginDTO;
import com.gg.turnlook.Backend.DTO.UsuarioModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import com.gg.turnlook.Backend.DTO.UsuarioCrearDTO;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final SesionService sesionService;

    public UsuarioController(UsuarioService usuarioService, SesionService sesionService) {
        this.usuarioService = usuarioService;
        this.sesionService = sesionService;
    }

    /// ENDPOINTS


    @PostMapping("/inicio_sesion")
    public ResponseEntity<?> iniciarSesion(@RequestBody LoginDTO login,
                                           HttpSession sesion) {
        Optional<Usuario> u = usuarioService.inicioSesion(login);
        if (u.isPresent()) {
            sesion.setAttribute("userId", u.get().getId());
            sesion.setAttribute("userRoles", usuarioService.setRolesComoString(u.get()));
        }
        return u.isPresent() ? ResponseEntity.ok().body("Has iniciado sesion")
                : ResponseEntity.status(401).body("Credenciales incorrectas");
    }


    @PostMapping("/crear")
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody UsuarioCrearDTO u) {
        try {
            usuarioService.crearUsuario(u);
            return ResponseEntity.ok().body("Se creo al usuario");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear usuario");
        }
    }

    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarUsuario(@PathVariable("id") Integer id,
                                              @Valid @RequestBody UsuarioModificarDTO usuario,
                                              HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        Optional<Usuario> user = usuarioService.listarUsuarioPorId(id);
        if(user.isEmpty()) return ResponseEntity.status(404).body("No existe el usuario");

        if(!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())
           && !Objects.equals((Integer) sesion.getAttribute("userId"), user.get().getId())){
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            usuarioService.modificarUsuario(usuario, user.get());
            return ResponseEntity.ok().body("Usuario modificado");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al modificar usuario");
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable("id") Integer id,
                                             HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            return usuarioService.eliminarUsuario(id) ?
                    ResponseEntity.ok().body("Se elimino al usuario")
                    : ResponseEntity.status(404).body("No se encontro al usuario");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar usuario");
        }
    }


    @GetMapping("/listar")
    public ResponseEntity<?> listarUsuarios(HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            return ResponseEntity.ok().body(usuarioService.listarUsuarios());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al listar usuarios");
        }
    }


    @GetMapping("/listar/filtrar")
    public ResponseEntity<?> filtrarListaUsuarios(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) Boolean activo,
            HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            List<Usuario> usuarios = usuarioService.filtrarListaUsuarios(nombre, apellido, activo);
            return !usuarios.isEmpty() ? ResponseEntity.ok().body(usuarios)
                    : ResponseEntity.status(404).body("No se encontraron usuarios");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al filtrar usuarios");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> filtrarUsuariosId(@PathVariable Integer id, HttpSession sesion) {

        if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            return ResponseEntity.status(403).body("No tenes permisos");
        }

        try {
            Optional<Usuario> u = usuarioService.listarUsuarioPorId(id);
            return u.isPresent() ?
                    ResponseEntity.ok().body(u.get())
                    : ResponseEntity.status(404).body("No se encontro a ningun usuario");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al filtrar usuarios");
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> filtrarUsuariosEmail(@PathVariable String email, HttpSession sesion) {

        Optional<?> u;
        try {
            if (!sesionService.isLogged(sesion)) return ResponseEntity.status(401).body("No estas logeado");

            if (sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
                u = usuarioService.listarUsuariosPorEmailAdmin(email);
            } else if (sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
                u = usuarioService.listarUsuariosPorEmailEmpleador(email);
            } else {
                return ResponseEntity.status(403).body("No tenes permisos");
            }
            return u.isPresent() ?
                    ResponseEntity.ok().body(u.get())
                    : ResponseEntity.status(404).body("No se encontro a ningun usuario");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al filtrar usuarios");
        }
    }
}
