package com.jesusygeremias.model.cuentas;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("CORRIENTE")
@Getter
@Setter
@RequiredArgsConstructor
public class CuentaCorriente extends CuentaBancaria {
    // Campos específicos opcionales
}
