package com.gg.turnlook.Controllers;

import com.gg.turnlook.Model.ReqInicioSesion;
import com.gg.turnlook.Model.Usuario;
import com.gg.turnlook.Service.UsuarioService;
import org.apache.coyote.Response;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private Usuario user = null;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /// ENDPOINTS


    @PostMapping("/inicio_sesion")
    public ResponseEntity<?> iniciarSesion(@RequestBody ReqInicioSesion login){
        Optional<Usuario> u = usuarioService.inicioSesion(login);
        if (u.isPresent()) user = u.get();
        return user != null ? ResponseEntity.ok().body("Has iniciado sesion")
                             : ResponseEntity.status(404).body("Credenciales incorrectas");
    }

    // BORRAR DESPUES
    @PostMapping("/cerrar_sesion")
    public ResponseEntity<?> cerrarSesion(){
        user = null;
        return ResponseEntity.ok("cerraste");
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario u) {
        try {
            usuarioService.crearUsuario(u);
            return ResponseEntity.ok().body("Se creo al usuario");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear usuario");
        }
    }

    @PatchMapping("/modificar/{id}")
    public ResponseEntity<?> modificarUsuario(@PathVariable("id") Integer id, @RequestBody Usuario u) {
        try{
            return usuarioService.modificarUsuario(id,u).isPresent() ?
                    ResponseEntity.ok().body("Se modifico al usuario correctamente")
                    : ResponseEntity.status(404).body("No se encontro al usuario");
        }catch(Exception e){
            return ResponseEntity.status(500).body("Error al modificar usuario");
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
       try {
           return usuarioService.eliminarUsuario(id) ?
                   ResponseEntity.ok().body("Se elimino al usuario")
                   : ResponseEntity.status(404).body("No se encontro al usuario");
       }catch(Exception e){
           return ResponseEntity.status(500).body("Error al eliminar usuario");
       }
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarUsuarios() {
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
            @RequestParam(required = false) Boolean activo) {
        try {
            List<Usuario> usuarios = usuarioService.filtrarListaUsuarios(nombre, apellido, activo);
            return !usuarios.isEmpty() ? ResponseEntity.ok().body(usuarios)
                    : ResponseEntity.status(404).body("No se encontraron usuarios");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al filtrar usuarios");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> filtrarUsuariosId(@PathVariable Integer id) {
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
    public ResponseEntity<?> filtrarUsuariosEmail(@PathVariable String email) {
        try {
            Optional<Usuario> u = usuarioService.listarUsuariosPorEmail(email);
            return u.isPresent() ?
                    ResponseEntity.ok().body(u.get())
                    : ResponseEntity.status(404).body("No se encontro a ningun usuario");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al filtrar usuarios");
        }
    }
}
