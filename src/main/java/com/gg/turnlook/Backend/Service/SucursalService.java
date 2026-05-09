package com.gg.turnlook.Backend.Service;

import com.gg.turnlook.Backend.DTO.SucursalCrearDTO;
import com.gg.turnlook.Backend.Model.Categoria;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Repository.CategoriaRepository;
import com.gg.turnlook.Backend.Repository.SucursalRepository;
import com.gg.turnlook.Backend.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SucursalService {

    private final SucursalRepository sucRepo;
    private final CategoriaRepository catRepo;
    private final UsuarioRepository userRepo;

    public SucursalService(SucursalRepository sucRepo, CategoriaRepository catRepo, UsuarioRepository userRepo) {
        this.sucRepo = sucRepo;
        this.catRepo = catRepo;
        this.userRepo = userRepo;
    }


    /// METODOS

    public Optional<Sucursal> crearSucursal(SucursalCrearDTO sucursal, Integer userId) {

        Optional<Categoria> cat = catRepo.findById(sucursal.getCategoriaId());
        if (cat.isEmpty()) return Optional.empty();

        Usuario twin = userRepo.findById(userId).get(); // no hace falta opt acA
        Sucursal suc = new Sucursal(sucursal.getNombre(), sucursal.getDireccion(),
                sucursal.getTelefono(), sucursal.getDescripcion(),
                cat.get(), twin);
        return Optional.of(sucRepo.save(suc));
    }

    // modificar aca

    public boolean eliminarSucursal(Integer id) {
        Optional<Sucursal> sucursal = sucRepo.findById(id);
        if (sucursal.isEmpty()) return false;

        //sucRepo.delete(sucursal.get());  ver si dejo este o el de activo -> false
        sucursal.get().setActivo(false);
        sucRepo.save(sucursal.get());
        return true;
    }

    public List<Sucursal> listarSucursales() {
        return sucRepo.findByActivoTrue();
    }

    public List<Sucursal> filtrarListaSucursales(String nombre, Boolean activo,
                                                 Integer catId, Integer userId) {

        return sucRepo.findAll().stream().
                filter(s -> nombre == null || s.getNombre().equalsIgnoreCase(nombre)).
                filter(s -> activo == null || s.isActivo() == activo).
                filter(s -> catId == null || s.getCategoria().getId() == catId).
                filter(s -> userId == null || s.getUsuario().getId() == userId).
                toList();
    }

    public Optional<Sucursal> listarSucursalPorId(Integer id){
        return sucRepo.findById(id);
    }
}
