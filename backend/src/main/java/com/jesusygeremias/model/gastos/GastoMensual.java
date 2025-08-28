package com.jesusygeremias.model.gastos;

import com.jesusygeremias.model.cuentas.CuentaBancaria;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "gasto_mensual",
        uniqueConstraints = @UniqueConstraint(columnNames = {"mes", "anio", "descripcion"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GastoMensual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mes; // Ejemplo: "ENERO", "FEBRERO"
    private int anio;   // Año del gasto
    private String categoria;
    private String descripcion;
    private double monto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cuenta_id")
    private CuentaBancaria cuenta;
}
