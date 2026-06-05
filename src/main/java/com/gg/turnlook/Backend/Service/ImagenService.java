package com.gg.turnlook.Backend.Service;


import com.gg.turnlook.Backend.Model.Imagen;
import com.gg.turnlook.Backend.Model.Servicio;
import com.gg.turnlook.Backend.Model.Sucursal;
import com.gg.turnlook.Backend.Model.Usuario;
import com.gg.turnlook.Backend.Repository.ImagenRepository;
import org.springframework.stereotype.Service;


@Service
public class ImagenService {

    private final ImagenRepository imagenRepo;


    public ImagenService(ImagenRepository imagenRepo){
        this.imagenRepo = imagenRepo;

    }



    ///  METODOS


    public void crearImagenServicio(Servicio servicio, String url){

        Imagen imagen = new Imagen();
        imagen.setServicio(servicio);
        imagen.setUrl(url);

        imagenRepo.save(imagen);
    }


    public void crearImagenSucursal(Sucursal sucursal, String url){

        Imagen imagen = new Imagen();
        imagen.setSucursal(sucursal);
        imagen.setUrl(url);

        imagenRepo.save(imagen);
    }


    public Imagen crearFotoPerfil(String url){

        Imagen imagen = new Imagen();
        if(url != null && !url.isBlank()){
            imagen.setUrl(url);
        }

        return imagenRepo.save(imagen);
    }


    public void cambiarFotoPerfil(Usuario usuario, String url){

        Imagen imagen = usuario.getFotoPerfil();

        if(imagen == null){
            imagen = crearFotoPerfil(url);
            usuario.setFotoPerfil(imagen);
            return;
        }

        imagen.setUrl(url);
        imagenRepo.save(imagen);
    }
}
