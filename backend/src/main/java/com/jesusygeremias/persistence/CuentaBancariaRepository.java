package com.jesusygeremias.persistence;

import com.jesusygeremias.model.cuentas.CuentaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CuentaBancariaRepository extends JpaRepository<CuentaBancaria, Long> {
    // Podemos agregar métodos específicos si queremos filtrar por banco o tipo
}
