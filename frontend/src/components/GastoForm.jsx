import { useState } from "react";
import { API_URL_GASTOS } from "../api";

export default function GastoForm({ cuentas, addGasto, addGastosBulk }) {
    const [gastos, setGastos] = useState([{ descripcion: "", monto: "", categoria: "", cuentaId: "" }]);

    const handleChange = (index, field, value) => {
        const updated = [...gastos];
        updated[index][field] = value;
        setGastos(updated);
    };

    const addFila = () => setGastos([...gastos, { descripcion: "", monto: "", categoria: "", cuentaId: "" }]);
    const borrarFila = (index) => setGastos(gastos.filter((_, i) => i !== index));

    const cargarPorDefecto = () => {
        const mesActual = new Date().getMonth() + 1;
        const defaults = [];
        const cuentaActivo = cuentas.find(c => c.banco === "ActivoBank");
        const openbankCorriente = cuentas.find(c => c.banco === "Openbank" && c.tipoCuenta.toLowerCase() === "corriente");
        const hipotecaOpenbank = cuentas.find(c => c.banco === "Openbank" && c.tipoCuenta.toLowerCase() === "hipoteca");

        if (cuentaActivo) {
            defaults.push(
                { descripcion: "Comunidad", monto: 174.94, categoria: "Vivienda", cuentaId: cuentaActivo.id },
                { descripcion: "Garaje", monto: 90, categoria: "Vivienda", cuentaId: cuentaActivo.id },
                { descripcion: "Internet", monto: 28, categoria: "Servicios", cuentaId: cuentaActivo.id },
                { descripcion: "Electricidad", monto: 37.5, categoria: "Servicios", cuentaId: cuentaActivo.id }
            );
            if ([1,3,5,7,9,11].includes(mesActual)) defaults.push({ descripcion: "Agua", monto: 36, categoria: "Servicios", cuentaId: cuentaActivo.id });
            if (mesActual >= 2 && mesActual <= 10) defaults.push({ descripcion: "PAC IBI + IVTM", monto: 49.01, categoria: "Impuestos", cuentaId: cuentaActivo.id });
            const seguroMonto = mesActual === 9 ? 45.19 : 39.68;
            if ([9,10,11,12,1,2,3,4,5,6].includes(mesActual)) defaults.push({ descripcion: "Seguro coche", monto: seguroMonto, categoria: "Seguros", cuentaId: cuentaActivo.id });
        }

        if (hipotecaOpenbank) defaults.push({ descripcion: "Hipoteca", monto: 676.33, categoria: "Vivienda", cuentaId: hipotecaOpenbank.id });
        if (openbankCorriente) {
            defaults.push(
                { descripcion: "Ahorro", monto: 490, categoria: "Ahorro", cuentaId: openbankCorriente.id },
                { descripcion: "Deuda Casa", monto: 300, categoria: "Deudas", cuentaId: openbankCorriente.id },
                { descripcion: "Gastos Habituales", monto: 545, categoria: "Gastos", cuentaId: openbankCorriente.id },
                { descripcion: "Ahorro Hipoteca", monto: 690, categoria: "Hipoteca", cuentaId: openbankCorriente.id },
                { descripcion: "Veterinaria", monto: 10.95, categoria: "Mascotas", cuentaId: openbankCorriente.id }
            );
        }

        setGastos(defaults);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mesNombre = new Date().toLocaleString("es-ES", { month: "long" }).toUpperCase();
        const anioActual = new Date().getFullYear();
        const nuevosGastos = [];

        for (let g of gastos) {
            if (!g.descripcion || !g.monto || !g.cuentaId) continue;
            const selectedCuenta = cuentas.find(c => c.id === parseInt(g.cuentaId));
            if (!selectedCuenta) continue;

            const newGasto = {
                descripcion: g.descripcion,
                monto: parseFloat(g.monto),
                categoria: g.categoria,
                mes: mesNombre,
                anio: anioActual,
                cuenta: {
                    id: selectedCuenta.id,
                    banco: selectedCuenta.banco,
                    tipoCuenta: selectedCuenta.tipoCuenta,
                    saldo: selectedCuenta.saldo
                }
            };

            const res = await fetch(API_URL_GASTOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newGasto)
            });

            if (res.ok) {
                const data = await res.json();
                nuevosGastos.push(data);
            } else {
                alert(await res.text());
            }
        }

        if (nuevosGastos.length > 0) {
            addGastosBulk ? addGastosBulk(nuevosGastos) : nuevosGastos.forEach(g => addGasto(g));
        }

        setGastos([{ descripcion: "", monto: "", categoria: "", cuentaId: "" }]);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center">
                <i className="fa fa-plus-circle mr-2 text-indigo-500"></i>
                Añadir Gastos
            </h2>

            {gastos.map((g, i) => (
                <div key={i} className="flex flex-wrap md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-4 mb-4 items-center">
                    <input type="text" placeholder="Descripción" value={g.descripcion} onChange={e => handleChange(i, "descripcion", e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 shadow-sm w-full md:w-auto"/>
                    <input type="number" placeholder="Monto" value={g.monto} onChange={e => handleChange(i, "monto", e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-300 shadow-sm w-full md:w-auto"/>
                    <input type="text" placeholder="Categoría" value={g.categoria} onChange={e => handleChange(i, "categoria", e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-300 shadow-sm w-full md:w-auto"/>
                    <select value={g.cuentaId} onChange={e => handleChange(i, "cuentaId", e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-300 shadow-sm w-full md:w-auto">
                        <option value="">Seleccionar cuenta</option>
                        {cuentas.map(c => <option key={c.id} value={c.id}>{c.banco} ({c.tipoCuenta || "N/A"})</option>)}
                    </select>
                    <button type="button" onClick={() => borrarFila(i)} className="text-red-500 hover:text-red-600 transition ml-2 md:ml-0">
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ))}

            <div className="flex flex-wrap gap-4 mt-2">
                <button type="button" onClick={addFila} className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 shadow-sm transition">Añadir fila</button>
                <button type="button" onClick={cargarPorDefecto} className="bg-purple-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600 shadow-lg transition">Cargar por defecto</button>
                <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 shadow-lg transition">Guardar</button>
            </div>
        </form>
    );
}
