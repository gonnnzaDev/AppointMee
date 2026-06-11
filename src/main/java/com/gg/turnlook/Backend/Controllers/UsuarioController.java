package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Usuario.*;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.JwtService;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final SesionService sesionService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UsuarioController(UsuarioService usuarioService, SesionService sesionService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.sesionService = sesionService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    /// ENDPOINTS



    @PostMapping("/inicio-sesion")
    public ResponseEntity<?> iniciarSesion(@Valid @RequestBody LoginDTO login) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPass()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Usuario usuario = usuarioService.listarUsuarioPorEmail(userDetails.getUsername());

        return ResponseEntity.ok().body(
                new LoginResponseDTO(jwtService.generarToken(usuario)));
    }


    @GetMapping("/me")
    public ResponseEntity<UsuarioMeDTO> getMe(Authentication authentication){

        String email = (String) authentication.getPrincipal();

        Usuario u = usuarioService.listarUsuarioPorEmail(email);

        return ResponseEntity.ok().body(new UsuarioMeDTO(
                u.getId(), usuarioService.setRolesComoString(u)));
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


    // ver si out
    @GetMapping("/listar/eliminados")
    public ResponseEntity<?> listarUsuariosEliminados(HttpSession sesion) {

        sesionService.isLogged(sesion);

        if (!sesionService.tieneRol(sesion, ERol.ADMINISTRADOR.name())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(usuarioService.listarUsuariosEliminados());
    }


    // borrar x otro distinto si pinta un filtrado
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
