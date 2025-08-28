import { useEffect, useState } from "react";
import GastoList from "./GastoList";
import GastoForm from "./GastoForm";
import SaldosPorCuenta from "./SaldosPorCuenta";
import { API_URL } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
    const [gastos, setGastos] = useState([]);

    const cuentas = {
        activaBank: 545,
        hipoteca: 690,
        ahorro: 490,
        deudaJulia: 300
    };

    const fetchGastos = async () => {
        try {
            const res = await fetch(`${API_URL}/gastos`);
            const data = await res.json();
            setGastos(data);
        } catch (e) {
            console.error("Error al obtener gastos:", e);
        }
    };

    useEffect(() => { fetchGastos(); }, []);

    const addGasto = (gasto) => setGastos([...gastos, gasto]);
    const updateGasto = (updated) =>
        setGastos(gastos.map((g) => (g.id === updated.id ? updated : g)));
    const deleteGasto = (id) => setGastos(gastos.filter((g) => g.id !== id));

    // Solo usamos el último mes para los cálculos
    const gastoActual = gastos.length > 0 ? gastos[gastos.length - 1] : null;

    const totalGastosActiva = gastoActual
        ? gastoActual.comunidad + gastoActual.garaje + gastoActual.internet + gastoActual.electricidad + gastoActual.agua + gastoActual.pac + gastoActual.seguro
        : 0;

    const saldoTotal = gastoActual
        ? gastoActual.salario - (totalGastosActiva + cuentas.hipoteca + gastoActual.revolutAhorro + cuentas.deudaJulia + gastoActual.revolutCorriente)
        : 0;

    const dataGrafica = [
        { cuenta: "ActivaBank", monto: cuentas.activaBank - totalGastosActiva },
        { cuenta: "Hipoteca", monto: cuentas.hipoteca },
        { cuenta: "Ahorro", monto: gastoActual ? gastoActual.revolutAhorro : 0 },
        { cuenta: "Revolut Corriente", monto: gastoActual ? gastoActual.revolutCorriente : 0 },
        { cuenta: "Deuda Julia", monto: cuentas.deudaJulia }
    ];

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Dashboard de Gastos</h1>

            <SaldosPorCuenta data={dataGrafica} saldoTotal={saldoTotal} />

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Distribución por cuenta</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dataGrafica}>
                        <XAxis dataKey="cuenta" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="monto" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <GastoForm addGasto={addGasto} />
            <GastoList gastos={gastos} deleteGasto={deleteGasto} updateGasto={updateGasto} />
        </div>
    );
}
