import { useState } from "react";
import { API_URL_INGRESOS } from "../api";

export default function IngresosForm({ cuentas, addIngresosBulk }) {
    const [ingresosForm, setIngresosForm] = useState([{ descripcion: "", monto: "", cuentaId: "" }]);

    const handleChange = (index, field, value) => {
        const updated = [...ingresosForm];
        updated[index][field] = value;
        setIngresosForm(updated);
    };

    const addFila = () => setIngresosForm([...ingresosForm, { descripcion: "", monto: "", cuentaId: "" }]);
    const borrarFila = (index) => setIngresosForm(ingresosForm.filter((_, i) => i !== index));

    const cargarPorDefecto = () => {
        const defaults = [];
        const openbankCorriente = cuentas.find(c => c.banco === "Openbank" && c.tipoCuenta?.toLowerCase() === "corriente");
        const activobankCorriente = cuentas.find(c => c.banco === "ActivoBank" && c.tipoCuenta?.toLowerCase() === "corriente");
        const revolutAhorro = cuentas.find(c => c.banco === "Revolut" && c.tipoCuenta?.toLowerCase() === "ahorro");
        const openbankHipoteca = cuentas.find(c => c.banco === "Openbank" && c.tipoCuenta?.toLowerCase() === "hipoteca");

        if (openbankCorriente) defaults.push({ descripcion: "Salario", monto: 2170.23, cuentaId: openbankCorriente.id });
        if (activobankCorriente) defaults.push({ descripcion: "Gastos Habituales", monto: 545, cuentaId: activobankCorriente.id });
        if (revolutAhorro) defaults.push({ descripcion: "Ahorro", monto: 490, cuentaId: revolutAhorro.id });
        if (openbankHipoteca) defaults.push({ descripcion: "Ahorro Hipoteca", monto: 690, cuentaId: openbankHipoteca.id });

        setIngresosForm(defaults);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (ingresosForm.length === 0) return;

        const mesNombre = new Date().toLocaleString("es-ES", { month: "long" }).toUpperCase();
        const anioActual = new Date().getFullYear();
        const nuevosIngresos = [];

        for (let ing of ingresosForm) {
            if (!ing.descripcion || !ing.monto || !ing.cuentaId) continue;
            const selectedCuenta = cuentas.find(c => c.id === parseInt(ing.cuentaId));
            if (!selectedCuenta) continue;

            const payload = {
                descripcion: ing.descripcion,
                monto: parseFloat(ing.monto),
                mes: mesNombre,
                anio: anioActual,
                cuenta: {
                    id: selectedCuenta.id,
                    banco: selectedCuenta.banco,
                    saldo: selectedCuenta.saldo,
                    tipoCuenta: selectedCuenta.tipoCuenta
                }
            };

            try {
                const res = await fetch(API_URL_INGRESOS, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    nuevosIngresos.push(data);
                } else {
                    alert(await res.text());
                }
            } catch (err) {
                alert(err.message || "Error al enviar ingreso");
            }
        }

        if (nuevosIngresos.length > 0) addIngresosBulk(nuevosIngresos);
        setIngresosForm([{ descripcion: "", monto: "", cuentaId: "" }]);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600 flex items-center">
                <i className="fa fa-plus-circle mr-2 text-indigo-500"></i>
                Añadir Ingresos
            </h2>

            {ingresosForm.map((ing, i) => (
                <div key={i} className="flex flex-wrap md:grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-center">
                    <input type="text" placeholder="Descripción" value={ing.descripcion} onChange={e => handleChange(i, "descripcion", e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 shadow-sm w-full md:w-auto"/>
                    <input type="number" placeholder="Monto" value={ing.monto} onChange={e => handleChange(i, "monto", e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-300 shadow-sm w-full md:w-auto"/>
                    <select value={ing.cuentaId} onChange={e => handleChange(i, "cuentaId", e.target.value)}
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
