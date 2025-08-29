package com.jesusygeremias.controllers;

import com.jesusygeremias.model.backup.BackupData;
import com.jesusygeremias.model.cuentas.CuentaBancaria;
import com.jesusygeremias.persistence.CuentaBancariaRepository;
import com.jesusygeremias.persistence.GastoMensualRepository;
import com.jesusygeremias.persistence.IngresoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/backup")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BackupController {

    private final CuentaBancariaRepository cuentaRepository;

    private final GastoMensualRepository gastoRepository;

    private final IngresoRepository ingresoRepository;

    /**
     * Exporta toda la base de datos en un JSON
     */
    @GetMapping("/export")
    public BackupData exportBackup() {
        BackupData data = new BackupData();
        data.setCuentas(cuentaRepository.findAll());
        data.setGastos(gastoRepository.findAll());
        data.setIngresos(ingresoRepository.findAll());
        return data;
    }

    /**
     * Importa un backup en formato JSON
     */
    @PostMapping("/import")
    public String importBackup(@RequestBody BackupData data) {
        try {
            // Borrar lo existente
            ingresoRepository.deleteAll();
            gastoRepository.deleteAll();
            cuentaRepository.deleteAll();

            // Limpiar IDs para que JPA genere nuevos
            data.getCuentas().forEach(c -> c.setId(null));

            // Guardar todas las cuentas primero
            List<CuentaBancaria> cuentasGuardadas = cuentaRepository.saveAll(data.getCuentas());

            // Actualizar referencias de cuentas en gastos e ingresos
            actualizarReferenciasCuenta(data.getGastos(), cuentasGuardadas);
            actualizarReferenciasCuenta(data.getIngresos(), cuentasGuardadas);

            // Guardar movimientos
            gastoRepository.saveAll(data.getGastos());
            ingresoRepository.saveAll(data.getIngresos());

            return "Backup restaurado correctamente";
        } catch (Exception e) {
            return "Error al importar backup: " + e.getMessage();
        }
    }

    private <T> void actualizarReferenciasCuenta(List<T> movimientos, List<CuentaBancaria> cuentasGuardadas)
            throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
        for (T mov : movimientos) {
            // Obtener la cuenta original
            CuentaBancaria cuentaOriginal = (CuentaBancaria) mov.getClass().getMethod("getCuenta").invoke(mov);
            if (cuentaOriginal != null) {
                final CuentaBancaria finalCuentaOriginal = cuentaOriginal; // ahora sí es efectivamente final

                CuentaBancaria nuevaCuenta = cuentasGuardadas.stream()
                        .filter(c -> c.getBanco().equals(finalCuentaOriginal.getBanco())
                                && c.getSaldo() == finalCuentaOriginal.getSaldo()
                                && c.isActivo() == finalCuentaOriginal.isActivo()
                                && c.getClass().isAssignableFrom(finalCuentaOriginal.getClass()))
                        .findFirst()
                        .orElse(null);

                mov.getClass().getMethod("setCuenta", CuentaBancaria.class).invoke(mov, nuevaCuenta);
            }
        }
    }

}
