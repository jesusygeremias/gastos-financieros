package com.jesusygeremias.persistence;

import com.jesusygeremias.model.gastos.GastoMensual;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GastoMensualRepository extends JpaRepository<GastoMensual, Long> {}
