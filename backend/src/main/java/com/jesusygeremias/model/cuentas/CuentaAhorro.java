package com.jesusygeremias.model.cuentas;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("AHORRO")
@Getter
@Setter
@RequiredArgsConstructor
public class CuentaAhorro extends CuentaBancaria {
    // Puedes añadir campos específicos si quieres
}
