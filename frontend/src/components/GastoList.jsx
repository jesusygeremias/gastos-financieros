import GastoCard from "./GastoCard";
import { API_URL } from "../api"; // <-- importamos la URL global

export default function GastoList({ gastos, deleteGasto }) {
    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/gastos/${id}`, { method: "DELETE" });
            deleteGasto(id);
        } catch (e) {
            console.error("Error al eliminar gasto:", e);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gastos.map((gasto) => (
                <GastoCard key={gasto.id} gasto={gasto} onDelete={handleDelete} />
            ))}
        </div>
    );
}
