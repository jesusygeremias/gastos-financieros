package com.jesusygeremias.model.cuentas;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("HIPOTECA")
@Getter
@Setter
@RequiredArgsConstructor
public class CuentaHipoteca extends CuentaBancaria {
    // Campos específicos opcionales
}
