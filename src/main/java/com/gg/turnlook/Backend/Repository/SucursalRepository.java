package com.gg.turnlook.Backend.Repository;

import com.gg.turnlook.Backend.Model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SucursalRepository extends JpaRepository<Sucursal, Integer> {

    Optional<Sucursal> findByNombre(String nombre);
    List<Sucursal> findByActivoTrue();
    List<Sucursal> findByEmpleadorId(Integer empleadorId);
}
