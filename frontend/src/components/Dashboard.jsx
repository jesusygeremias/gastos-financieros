import { useEffect, useState } from "react";
import GastoList from "./GastoList";
import GastoForm from "./GastoForm";
import IngresosForm from "./IngresosForm";
import IngresosList from "./IngresosList";
import SaldosPorCuenta from "./SaldosPorCuenta";
import { API_URL_CUENTAS, API_URL_GASTOS, API_URL_INGRESOS } from "../api";
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
        let nuevosSaldos = cuentas.map(c => ({
            id: c.id,
            banco: c.banco,
            cuenta: `${c.banco} (${c.tipoCuenta || "Sin tipo"})`,
            monto: c.saldo
        }));

        gastos.forEach(g => {
            if (g.cuenta) {
                const idx = nuevosSaldos.findIndex(s => s.id === g.cuenta.id);
                if (idx !== -1) nuevosSaldos[idx].monto -= g.monto;
            }
        });

        ingresos.forEach(i => {
            if (i.cuenta) {
                const idx = nuevosSaldos.findIndex(s => s.id === i.cuenta.id);
                if (idx !== -1) nuevosSaldos[idx].monto += i.monto;
            }
        });

        setSaldos(nuevosSaldos);
    }, [cuentas, gastos, ingresos]);

    // --- FUNCIONES PARA ACTUALIZAR SALDOS POR MOVIMIENTO ---
    const actualizarSaldos = (movimiento, tipo, revertir = false) => {
        if (!movimiento.cuenta) return;
        setSaldos(prev =>
            prev.map(s => {
                if (s.id === movimiento.cuenta.id) {
                    let nuevoMonto = tipo === "gasto"
                        ? (revertir ? s.monto + movimiento.monto : s.monto - movimiento.monto)
                        : (revertir ? s.monto - movimiento.monto : s.monto + movimiento.monto);
                    return { ...s, monto: nuevoMonto };
                }
                return s;
            })
        );
    };

    // --- GASTOS ---
    const addGasto = gasto => {
        if (!gasto.cuenta) return;
        setGastos([...gastos, gasto]);
        actualizarSaldos(gasto, "gasto");
    };

    const updateGasto = updated => {
        const old = gastos.find(g => g.id === updated.id);
        if (!old?.cuenta || !updated?.cuenta) return;
        setGastos(gastos.map(g => g.id === updated.id ? updated : g));
        actualizarSaldos(old, "gasto", true);
        actualizarSaldos(updated, "gasto");
    };

    const deleteGasto = id => {
        const gasto = gastos.find(g => g.id === id);
        if (!gasto?.cuenta) return;
        setGastos(gastos.filter(g => g.id !== id));
        actualizarSaldos(gasto, "gasto", true);
    };

    // --- INGRESOS ---
    const addIngreso = ingreso => {
        if (!ingreso.cuenta) return;
        setIngresos([...ingresos, ingreso]);
        actualizarSaldos(ingreso, "ingreso");
    };

    const updateIngreso = updated => {
        const old = ingresos.find(i => i.id === updated.id);
        if (!old?.cuenta || !updated?.cuenta) return;
        setIngresos(ingresos.map(i => i.id === updated.id ? updated : i));
        actualizarSaldos(old, "ingreso", true);
        actualizarSaldos(updated, "ingreso");
    };

    const deleteIngreso = id => {
        const ingreso = ingresos.find(i => i.id === id);
        if (!ingreso?.cuenta) return;
        setIngresos(ingresos.filter(i => i.id !== id));
        actualizarSaldos(ingreso, "ingreso", true);
    };

    const saldoTotal = saldos.reduce((sum, c) => sum + c.monto, 0);

    return (
        <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 tracking-tight flex items-center justify-center">
                <i className="fa fa-wallet mr-3 text-indigo-500"></i>
                Dashboard Financiero
            </h1>

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
                        <Tooltip
                            contentStyle={{ backgroundColor: "#f9fafb", borderRadius: 8 }}
                            itemStyle={{ color: "#111827" }}
                        />
                        <Bar dataKey="monto" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <IngresosForm cuentas={cuentas} addIngreso={addIngreso} />
            <IngresosList ingresos={ingresos} updateIngreso={updateIngreso} deleteIngreso={deleteIngreso} />

            

            <GastoForm cuentas={cuentas} addGasto={addGasto} />
            <GastoList gastos={gastos} updateGasto={updateGasto} deleteGasto={deleteGasto} />
        </div>
    );
}
