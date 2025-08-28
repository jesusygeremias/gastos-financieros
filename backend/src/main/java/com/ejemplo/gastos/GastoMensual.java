package com.ejemplo.gastos;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
@Table(name = "gasto_mensual")
public class GastoMensual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mes;
    private double salario;
    private double comunidad;
    private double garaje;
    private double internet;
    private double electricidad;
    private double agua;
    private double pac;
    private double seguro;

    private double revolutAhorro;
    private double revolutCorriente;
}
