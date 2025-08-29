import { useEffect, useState } from "react";
import GastoList from "./GastoList";
import GastoForm from "./GastoForm";
import IngresosForm from "./IngresosForm";
import IngresosList from "./IngresosList";
import SaldosPorCuenta from "./SaldosPorCuenta";
import { API_URL_CUENTAS, API_URL_GASTOS, API_URL_INGRESOS, API_URL_BACKUP } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
    const [gastos, setGastos] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [saldos, setSaldos] = useState([]);

    // --- FETCH DATA ---
    const fetchCuentas = async () => {
        try {
            const res = await fetch(API_URL_CUENTAS);
            const data = await res.json();
            setCuentas(data);
        } catch (e) {
            console.error("Error al obtener cuentas:", e);
        }
    };

    const fetchGastos = async () => {
        try {
            const res = await fetch(API_URL_GASTOS);
            const data = await res.json();
            setGastos(data.filter(g => g.cuenta !== null));
        } catch (e) {
            console.error("Error al obtener gastos:", e);
        }
    };

    const fetchIngresos = async () => {
        try {
            const res = await fetch(API_URL_INGRESOS);
            const data = await res.json();
            setIngresos(data.filter(i => i.cuenta !== null));
        } catch (e) {
            console.error("Error al obtener ingresos:", e);
        }
    };

    useEffect(() => {
        fetchCuentas();
        fetchGastos();
        fetchIngresos();
    }, []);

    // --- RECALCULAR SALDOS ---
    useEffect(() => {
        const nuevos = cuentas.map(c => ({
            id: c.id,
            banco: c.banco,
            cuenta: `${c.banco} (${c.tipoCuenta || "Sin tipo"})`,
            monto: Number(c.saldo || 0)
        }));

        gastos.forEach(g => {
            if (g?.cuenta?.id != null) {
                const idx = nuevos.findIndex(s => s.id === g.cuenta.id);
                if (idx !== -1) nuevos[idx].monto -= Number(g.monto || 0);
            }
        });

        ingresos.forEach(i => {
            if (i?.cuenta?.id != null) {
                const idx = nuevos.findIndex(s => s.id === i.cuenta.id);
                if (idx !== -1) nuevos[idx].monto += Number(i.monto || 0);
            }
        });

        setSaldos(nuevos);
    }, [cuentas, gastos, ingresos]);

    // --- FUNCIONES PARA ACTUALIZAR SALDOS POR MOVIMIENTO ---
    const actualizarSaldos = (movimiento, tipo, revertir = false) => {
        if (!movimiento?.cuenta?.id) return;
        setSaldos(prev =>
            prev.map(s => {
                if (s.id === movimiento.cuenta.id) {
                    const amount = Number(movimiento.monto || 0);
                    const nuevoMonto = tipo === "gasto"
                        ? (revertir ? s.monto + amount : s.monto - amount)
                        : (revertir ? s.monto - amount : s.monto + amount);
                    return { ...s, monto: nuevoMonto };
                }
                return s;
            })
        );
    };

    // --- GASTOS ---
    const addGasto = (gasto) => {
        if (!gasto?.cuenta?.id) return;
        setGastos(prev => [...prev, gasto]);
        actualizarSaldos(gasto, "gasto");
    };

    const addGastosBulk = (nuevos) => {
        if (!Array.isArray(nuevos) || nuevos.length === 0) return;
        setGastos(prev => [...prev, ...nuevos]);
        nuevos.forEach(g => g?.cuenta && actualizarSaldos(g, "gasto"));
    };

    const updateGasto = (updated) => {
        setGastos(prev => {
            const old = prev.find(g => g.id === updated.id);
            if (!old?.cuenta || !updated?.cuenta) return prev;
            actualizarSaldos(old, "gasto", true);
            actualizarSaldos(updated, "gasto");
            return prev.map(g => g.id === updated.id ? updated : g);
        });
    };

    const deleteGasto = async (id) => {
        try {
            const res = await fetch(`${API_URL_GASTOS}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error al borrar gasto");
            setGastos(prev => {
                const gasto = prev.find(g => g.id === id);
                if (gasto?.cuenta) actualizarSaldos(gasto, "gasto", true);
                return prev.filter(g => g.id !== id);
            });
        } catch (err) {
            alert(err.message);
        }
    };

    // --- INGRESOS ---
    const addIngreso = (ingreso) => {
        if (!ingreso?.cuenta?.id) return;
        setIngresos(prev => [...prev, ingreso]);
        actualizarSaldos(ingreso, "ingreso");
    };

    const addIngresosBulk = (nuevos) => {
        if (!Array.isArray(nuevos) || nuevos.length === 0) return;
        setIngresos(prev => [...prev, ...nuevos]);
        nuevos.forEach(i => i?.cuenta && actualizarSaldos(i, "ingreso"));
    };

    const updateIngreso = (updated) => {
        setIngresos(prev => {
            const old = prev.find(i => i.id === updated.id);
            if (!old?.cuenta || !updated?.cuenta) return prev;
            actualizarSaldos(old, "ingreso", true);
            actualizarSaldos(updated, "ingreso");
            return prev.map(i => i.id === updated.id ? updated : i);
        });
    };

    const deleteIngreso = async (id) => {
        try {
            const res = await fetch(`${API_URL_INGRESOS}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error al borrar ingreso");
            setIngresos(prev => {
                const ingreso = prev.find(i => i.id === id);
                if (ingreso?.cuenta) actualizarSaldos(ingreso, "ingreso", true);
                return prev.filter(i => i.id !== id);
            });
        } catch (err) {
            alert(err.message);
        }
    };

    const saldoTotal = saldos.reduce((sum, c) => sum + Number(c.monto || 0), 0);

    // --- BACKUP FUNCTIONS ---
    const exportBackup = async () => {
        try {
            const res = await fetch(`${API_URL_BACKUP}/export`);
            if (!res.ok) throw new Error("Error al exportar backup");
            const data = await res.json();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `backup_${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert(err.message);
        }
    };

    const importBackup = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            const res = await fetch(`${API_URL_BACKUP}/import`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json)
            });

            if (!res.ok) throw new Error(await res.text());
            alert("Backup importado correctamente");
            fetchCuentas();
            fetchGastos();
            fetchIngresos();
        } catch (err) {
            alert(err.message || "Error al importar backup");
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-700 tracking-tight flex items-center justify-center">
                <i className="fa fa-wallet mr-3 text-indigo-500"></i>
                Dashboard Financiero
            </h1>

            {/* --- BACKUP CARD --- */}
            <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 flex flex-col md:flex-row items-center gap-4 justify-center">
                <button onClick={exportBackup} className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 shadow-lg transition">
                    Exportar Backup
                </button>
                <label className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 shadow-lg transition cursor-pointer">
                    Importar Backup
                    <input type="file" accept=".json" onChange={importBackup} className="hidden" />
                </label>
            </div>

            <SaldosPorCuenta data={saldos} saldoTotal={saldoTotal} />

            <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
                    <i className="fa fa-chart-bar mr-2 text-blue-500"></i>
                    Distribución por cuenta
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={saldos}>
                        <XAxis dataKey="cuenta" tick={{ fill: "#4b5563", fontSize: 14 }} />
                        <YAxis tick={{ fill: "#4b5563", fontSize: 14 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }} itemStyle={{ color: "#111827" }} />
                        <Bar dataKey="monto" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <IngresosForm cuentas={cuentas} addIngreso={addIngreso} addIngresosBulk={addIngresosBulk} />
            <IngresosList ingresos={ingresos} updateIngreso={updateIngreso} deleteIngreso={deleteIngreso} />

            <div className="my-8" />

            <GastoForm cuentas={cuentas} addGasto={addGasto} addGastosBulk={addGastosBulk} />
            <GastoList gastos={gastos} updateGasto={updateGasto} deleteGasto={deleteGasto} />
        </div>
    );
}
