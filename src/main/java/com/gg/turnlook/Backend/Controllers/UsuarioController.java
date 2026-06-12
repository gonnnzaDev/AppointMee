package com.gg.turnlook.Backend.Controllers;

import com.gg.turnlook.Backend.DTO.Usuario.*;
import com.gg.turnlook.Backend.Enum.ERol;
import com.gg.turnlook.Backend.Excepciones.ForbiddenException;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Service.JwtService;
import com.gg.turnlook.Backend.Service.SesionService;
import com.gg.turnlook.Backend.Service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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


    @PostMapping("/recuperar-cuenta")
    public ResponseEntity<?> recuperarCuenta(@Valid @RequestBody LoginDTO login){

        usuarioService.recuperarCuenta(login);
        return ResponseEntity.ok().body("Su cuenta fue activada correctamente. " +
                "Ya puede iniciar sesion");
    }


    @GetMapping("/me")
    public ResponseEntity<UsuarioMeDTO> getMe(Authentication auth){

        String email = (String) auth.getPrincipal();

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
                                              Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        if (!sesionService.tieneRol(user, ERol.ADMINISTRADOR.name())
                && !Objects.equals(id, user.getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        usuarioService.modificarUsuario(usuario, id);
        return ResponseEntity.ok().body("Usuario modificado");
    }


    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable("id") Integer id,
                                             Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario usuario = usuarioService.listarUsuarioPorEmail(email);

        if(!Objects.equals(usuario.getId(), id)){
            throw new ForbiddenException("No podes eliminar tu cuenta siendo Administrador");
        }

        usuarioService.eliminarUsuario(id);
        return ResponseEntity.ok().body("Se eliminó al usuario");
    }


    @PreAuthorize("hasRole('CLIENTE')")
    @DeleteMapping("/borrar-cuenta/{usuarioId}")
    public ResponseEntity<?> borrarUsuario(@PathVariable("usuarioId") Integer usuarioId,
                                           Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario usuario = usuarioService.listarUsuarioPorEmail(email);

        if(!Objects.equals(usuario.getId(), usuarioId)){
            throw new ForbiddenException("No tenes permisos");
        }

        usuarioService.eliminarUsuario(usuarioId);
        return ResponseEntity.ok().body("Se eliminó la cuenta");
    }


    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/listar")
    public ResponseEntity<?> listarUsuarios(Authentication auth) {

        return ResponseEntity.ok().body(usuarioService.listarUsuarios());
    }


    // ver si out
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/listar/eliminados")
    public ResponseEntity<?> listarUsuariosEliminados(Authentication auth) {

        return ResponseEntity.ok().body(usuarioService.listarUsuariosEliminados());
    }


    // borrar x otro distinto si pinta un filtrado
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/listar/filtrar")
    public ResponseEntity<?> filtrarListaUsuarios(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) Boolean activo,
            Authentication auth) {

        return ResponseEntity.ok().body(usuarioService.filtrarListaUsuarios(nombre, apellido, activo));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> filtrarUsuariosId(@PathVariable Integer id, Authentication auth) {

        String email = (String) auth.getPrincipal();

        Usuario user = usuarioService.listarUsuarioPorEmail(email);

        if (!sesionService.tieneRol(user, ERol.ADMINISTRADOR.name()) &&
                !Objects.equals(id, user.getId())) {
            throw new ForbiddenException("No tenes permisos");
        }

        return ResponseEntity.ok().body(usuarioService.verPerfilPorId(id));
    }


    @PreAuthorize("hasAnyRole('EMPLEADOR','ADMINISTRADOR')")
    @GetMapping("/email")
    public ResponseEntity<?> filtrarUsuariosEmail(@Valid @RequestBody UsuarioEmailDTO userEmail,
                                                  Authentication auth) {

        return ResponseEntity.ok().body(usuarioService.listarUsuariosPorEmail(userEmail));
    }


    // ver si es con formulario o notif a admin (DESPUES VER CON G)
    @PreAuthorize("!hasRole('ADMIN') && !hasRole('EMPLEADOR')")
    @PatchMapping("/{userId}/solicitar-ser-empleador")
    public ResponseEntity<?> solicitarRolEmpleador(@PathVariable("userId") Integer userId,
                                                   Authentication auth){

        usuarioService.solicitudRolEmpleador(userId);
        return ResponseEntity.ok().body("Se te otorgó el rol Empleador");
    }
}
