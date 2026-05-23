package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.LoginDTO;
import com.gg.turnlook.Backend.DTO.UsuarioModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
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
@CrossOrigin(origins = "*")
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
        Usuario u = usuarioService.inicioSesion(login);

        sesion.setAttribute("userId", u.getId());
        sesion.setAttribute("userRoles", usuarioService.setRolesComoString(u));

        return ResponseEntity.ok().body("Has iniciado sesion");
    }


    @PostMapping("/crear")
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody UsuarioCrearDTO u) {
        usuarioService.crearUsuario(u);
        return ResponseEntity.ok().body("Se creo al usuario");
    }


    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarUsuario(@PathVariable("id") Integer id,
                                              @Valid @RequestBody UsuarioModificarDTO usuario,
                                              HttpSession sesion) {

        Usuario user = sesionService.getUsuarioLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())
                && !Objects.equals(id, user.getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        usuarioService.modificarUsuario(usuario, id);
        return ResponseEntity.ok().body("Usuario modificado");
    }


    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable("id") Integer id,
                                             HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        usuarioService.eliminarUsuario(id);
        return ResponseEntity.ok().body("Se elimino al usuario");
    }


    @GetMapping("/listar")
    public ResponseEntity<?> listarUsuarios(HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(usuarioService.listarUsuarios());
    }


    @GetMapping("/listar/eliminados")
    public ResponseEntity<?> listarUsuariosEliminados(HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(usuarioService.listarUsuariosEliminados());
    }


    @GetMapping("/listar/filtrar")
    public ResponseEntity<?> filtrarListaUsuarios(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) Boolean activo,
            HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(usuarioService.filtrarListaUsuarios(nombre, apellido, activo));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> filtrarUsuariosId(@PathVariable Integer id, HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        Usuario u = usuarioService.listarUsuarioPorId(id);
        return ResponseEntity.ok().body(u);
    }


    @GetMapping("/email/{email}")
    public ResponseEntity<?> filtrarUsuariosEmail(@PathVariable String email, HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            return ResponseEntity.ok().body(usuarioService.listarUsuariosPorEmailAdmin(email));
        } else if (sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            return ResponseEntity.ok().body(usuarioService.listarUsuariosPorEmailEmpleador(email));
        } else {
            throw new ForbiddenException("No tenes permisos");
        }
    }
}
