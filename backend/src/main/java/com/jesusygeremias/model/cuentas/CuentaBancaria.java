package com.jesusygeremias.model.cuentas;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
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
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "tipoCuenta",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CuentaAhorro.class, name = "AHORRO"),
        @JsonSubTypes.Type(value = CuentaCorriente.class, name = "CORRIENTE"),
        @JsonSubTypes.Type(value = CuentaHipoteca.class, name = "HIPOTECA"),
        @JsonSubTypes.Type(value = CuentaRestaurante.class, name = "RESTAURANTE")
})
public abstract class CuentaBancaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String banco;
    private double saldo;
    private boolean activo;

    // Mapea el DiscriminatorColumn para que JPA lo rellene
    @Column(name = "tipo_cuenta", insertable = false, updatable = false)
    private String tipoCuenta;
}


