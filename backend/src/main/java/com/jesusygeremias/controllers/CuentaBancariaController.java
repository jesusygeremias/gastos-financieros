package com.jesusygeremias.controllers;

import com.jesusygeremias.model.cuentas.CuentaBancaria;
import com.jesusygeremias.persistence.CuentaBancariaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CuentaBancariaController {

    private final CuentaBancariaRepository repo;

    // Listar todas las cuentas
    @GetMapping
    public List<CuentaBancaria> listarCuentas() {
        return repo.findAll();
    }

    // Crear nueva cuenta
    @PostMapping
    public CuentaBancaria crear(@RequestBody CuentaBancaria cuenta) {
        return repo.save(cuenta);
    }

    // Actualizar saldo o datos de cuenta
    @PutMapping("/{id}")
    public CuentaBancaria actualizar(@PathVariable Long id, @RequestBody CuentaBancaria cuenta) {
        cuenta.setId(id);
        return repo.save(cuenta);
    }

    // Eliminar cuenta
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
