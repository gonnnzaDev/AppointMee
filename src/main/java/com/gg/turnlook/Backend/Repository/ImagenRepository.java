package com.gg.turnlook.Backend.Repository;



import com.gg.turnlook.Backend.Model.Imagen;
import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;




public interface ImagenRepository extends JpaRepository<Imagen, Integer> {

    List<Imagen> findBySucursal(Sucursal sucursal);

    List<Imagen> findByServicio(Servicio servicio);

    long countBySucursal(Sucursal sucursal);

    long countByServicio(Servicio servicio);

}


