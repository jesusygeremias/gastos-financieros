import { useState } from "react";
import { API_URL_INGRESOS } from "../api";

export default function IngresosForm({ cuentas, addIngreso }) {
    const [ingreso, setIngreso] = useState({
        descripcion: "",
        monto: "",
        cuentaId: ""
    });

    const handleChange = (field, value) => {
        setIngreso({ ...ingreso, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ingreso.descripcion || !ingreso.monto || !ingreso.cuentaId) return;

        const mesNombre = new Date().toLocaleString("es-ES", { month: "long" }).toUpperCase();
        const anioActual = new Date().getFullYear();

        const selectedCuenta = cuentas.find(c => c.id === parseInt(ingreso.cuentaId));
        if (!selectedCuenta) return;

        const newIngreso = {
            descripcion: ingreso.descripcion,
            monto: parseFloat(ingreso.monto),
            mes: mesNombre,
            anio: anioActual,
            cuenta: { ...selectedCuenta }
        };

        const res = await fetch(API_URL_INGRESOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newIngreso)
        });

        if (res.ok) {
            const data = await res.json();
            addIngreso(data); // Actualiza Dashboard y SaldosPorCuenta
        } else {
            alert(await res.text());
        }

        setIngreso({ descripcion: "", monto: "", cuentaId: "" });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Añadir Ingreso</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Descripción"
                    value={ingreso.descripcion}
                    onChange={e => handleChange("descripcion", e.target.value)}
                    className="p-3 border rounded-lg"
                />
                <input
                    type="number"
                    placeholder="Monto"
                    value={ingreso.monto}
                    onChange={e => handleChange("monto", e.target.value)}
                    className="p-3 border rounded-lg"
                />
                <select
                    value={ingreso.cuentaId}
                    onChange={e => handleChange("cuentaId", e.target.value)}
                    className="p-3 border rounded-lg"
                >
                    <option value="">Seleccionar cuenta</option>
                    {cuentas.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.banco} ({c.tipoCuenta || "N/A"})
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Guardar
            </button>
        </form>
    );
}
