package com.jesusygeremias.model.backup;

import com.jesusygeremias.model.cuentas.CuentaBancaria;
import com.jesusygeremias.model.gastos.GastoMensual;
import com.jesusygeremias.model.ingresos.IngresoMensual;
import lombok.Data;

import java.util.List;

@Data
public class BackupData {
    private List<CuentaBancaria> cuentas;
    private List<GastoMensual> gastos;
    private List<IngresoMensual> ingresos;
}