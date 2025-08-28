package com.jesusygeremias.persistence;

import com.jesusygeremias.model.ingresos.IngresoMensual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngresoRepository extends JpaRepository<IngresoMensual, Long> {
    List<IngresoMensual> findByMesAndAnio(String mes, int anio);
}
