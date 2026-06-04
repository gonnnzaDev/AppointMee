package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Usuario.LoginDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioEmailDTO;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioModificarDTO;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import com.gg.turnlook.Backend.DTO.Usuario.UsuarioCrearDTO;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

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
    public ResponseEntity<?> iniciarSesion(@Valid @RequestBody LoginDTO login,
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


    @DeleteMapping("/borrar-cuenta/{usuarioId}")
    public ResponseEntity<?> borrarUsuario(@PathVariable("usuarioId") Integer usuarioId,
                                           HttpSession sesion) {
        sesionService.isLogged(sesion);

        if(!Objects.equals(sesionService.getUsuarioId(sesion), usuarioId)){
            throw new ForbiddenException("No tenes permisos");
        }

        usuarioService.borrarUsuario(usuarioId);
        return ResponseEntity.ok().body("Se eliminó la cuenta permanentemente");
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

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name()) &&
            !Objects.equals(id, sesionService.getUsuarioId(sesion))) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(usuarioService.verPerfilPorId(id));
    }


    @GetMapping("/email")
    public ResponseEntity<?> filtrarUsuariosEmail(@Valid @RequestBody UsuarioEmailDTO userEmail,
                                                  HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name()) &&
            !sesionService.tieneRol(sesion, ERol.EMPLEADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(usuarioService.listarUsuariosPorEmail(userEmail));
    }


    // ver si es con formulario o notif a admin (DESPUES VER CON G)
    @PatchMapping("/{userId}/solicitar-ser-empleador")
    public ResponseEntity<?> solicitarRolEmpleador(@PathVariable("userId") Integer userId,
                                                   HttpSession sesion){
        sesionService.isLogged(sesion);

        if(sesionService.tieneRol(sesion, ERol.EMPLEADOR.name()) ||
                sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())){
            throw new ForbiddenException("No podes solicitar ser empleador siendo ya uno");
        }

        usuarioService.solicitudRolEmpleador(userId);
        return ResponseEntity.ok().body("Se te otorgó el rol Empleador");
    }
}
