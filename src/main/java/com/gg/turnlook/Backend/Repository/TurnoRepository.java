package com.gg.turnlook.Backend.Repository;



import com.gg.turnlook.Backend.Enum.EstadoTurno;
import com.gg.turnlook.Backend.Model.Turno;
import com.gg.turnlook.Backend.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;



public interface TurnoRepository extends JpaRepository<Turno, Integer> {


    List<Turno> findByEmpleadoAndFechaHoraBetweenAndEstadoNot(Usuario empleado,
                                                  LocalDateTime inicioDia, LocalDateTime finDia,
                                                              EstadoTurno estadoTurno);


    List<Turno> findByServicioSucursalId(Integer sucursalId);


    List<Turno> findByCliente(Usuario cliente);


}


