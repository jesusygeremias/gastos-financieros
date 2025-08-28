package com.ejemplo.gastos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
public class GastoController {

    @Autowired
    private GastoMensualRepository repo;

    @GetMapping
    public List<GastoMensual> listar() {
        return repo.findAll();
    }

    @PostMapping
    public GastoMensual crear(@RequestBody GastoMensual gasto) {
        return repo.save(gasto);
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
}
