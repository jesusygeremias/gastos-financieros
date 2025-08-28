import { useState } from "react";
import { API_URL } from "../api"; // <-- importamos la URL global

export default function GastoForm({ addGasto }) {
    const [mes, setMes] = useState("");
    const [salario, setSalario] = useState(2170.23);
    const [comunidad, setComunidad] = useState(174.94);
    const [garaje, setGaraje] = useState(90);
    const [internet, setInternet] = useState(28);
    const [electricidad, setElectricidad] = useState(37.5);
    const [agua, setAgua] = useState(18);
    const [pac, setPac] = useState(49.01);
    const [seguro, setSeguro] = useState(39.68);
    const [revolutAhorro, setRevolutAhorro] = useState(490);
    const [revolutCorriente, setRevolutCorriente] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const gasto = { mes, salario, comunidad, garaje, internet, electricidad, agua, pac, seguro, revolutAhorro, revolutCorriente };

        try {
            const res = await fetch(`${API_URL}/gastos`, {  // <-- usamos API_URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(gasto)
            });
            const data = await res.json();
            addGasto(data);
        } catch (e) {
            console.error("Error al crear gasto:", e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card mb-6">
            <h3 className="text-lg font-semibold mb-2">Nuevo Gasto Mensual</h3>
            <input 
                type="text" 
                placeholder="Mes" 
                value={mes} 
                onChange={e => setMes(e.target.value)} 
                className="mb-2 w-full p-1 border rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
                Agregar Gasto
            </button>
        </form>
    );
}
