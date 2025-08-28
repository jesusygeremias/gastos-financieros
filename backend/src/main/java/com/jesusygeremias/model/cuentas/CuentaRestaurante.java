package com.jesusygeremias.model.cuentas;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("RESTAURANTE")
@Getter
@Setter
@RequiredArgsConstructor
public class CuentaRestaurante extends CuentaBancaria {
    // Campos específicos opcionales
}
