package com.jesusygeremias.controllers;

import com.jesusygeremias.model.ingresos.IngresoMensual;
import com.jesusygeremias.persistence.CuentaBancariaRepository;
import com.jesusygeremias.persistence.IngresoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ingresos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class IngresoController {

    private final IngresoRepository ingresoRepository;
    private final CuentaBancariaRepository cuentaBancariaRepository;

    @GetMapping
    public List<IngresoMensual> getAll() {
        return ingresoRepository.findAll();
    }

    @PostMapping
    public IngresoMensual addIngreso(@RequestBody IngresoMensual ingreso) {
        return ingresoRepository.save(ingreso);
    }

    @PutMapping("/{id}")
    public IngresoMensual updateIngreso(@PathVariable Long id, @RequestBody IngresoMensual ingreso) {
        ingreso.setId(id);
        return ingresoRepository.save(ingreso);
    }

    @DeleteMapping("/{id}")
    public void deleteIngreso(@PathVariable Long id) {
        ingresoRepository.deleteById(id);
    }
}
