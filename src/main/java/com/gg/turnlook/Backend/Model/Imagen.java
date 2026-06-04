package com.gg.turnlook.Backend.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "imagenes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Imagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = true)
    private String url;

    @Column(name = "url_alt" ,nullable = false)
    private String urlAlt = "https://i.pinimg.com/originals/bb/b7/13/bbb713760b2b209894bce2b42fe8f4bd.jpg";
                                // ver si funca dsp

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sucursal_id")
    private Sucursal sucursal;



    /// METODOS

    public String getFotoValida(){
        return this.url != null ? url : urlAlt;
    }
}
