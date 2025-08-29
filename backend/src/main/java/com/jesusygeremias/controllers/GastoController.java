package com.jesusygeremias.controllers;

import com.jesusygeremias.model.cuentas.CuentaBancaria;
import com.jesusygeremias.model.gastos.GastoMensual;
import com.jesusygeremias.persistence.CuentaBancariaRepository;
import com.jesusygeremias.persistence.GastoMensualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GastoController {

    private final GastoMensualRepository repo;

    @GetMapping
    public List<GastoMensual> listar() {
        return repo.findAll();
    }

    @PutMapping("/{id}")
    public GastoMensual actualizar(@PathVariable Long id, @RequestBody GastoMensual gasto) {
        gasto.setId(id);
        return repo.save(gasto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PostMapping
    public ResponseEntity<?> addGasto(@RequestBody GastoMensual gasto) {
        try {
            GastoMensual saved = repo.save(gasto);
            return ResponseEntity.ok(saved);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Ya existe un gasto con esa categoría en este mes y año");
        }
    }

}
