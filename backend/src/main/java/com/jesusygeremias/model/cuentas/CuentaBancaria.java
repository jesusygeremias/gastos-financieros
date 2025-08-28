package com.jesusygeremias.model.cuentas;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cuenta_bancaria")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_cuenta", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "tipoCuenta"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CuentaAhorro.class, name = "Ahorro"),
        @JsonSubTypes.Type(value = CuentaCorriente.class, name = "Corriente"),
        @JsonSubTypes.Type(value = CuentaHipoteca.class, name = "Hipoteca"),
        @JsonSubTypes.Type(value = CuentaRestaurante.class, name = "Restaurante")
})
public abstract class CuentaBancaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String banco; // Ej: "Revolut", "Openbank", "ActivoBank", "Pluxee"
    private double saldo;
    private boolean activo;
}
