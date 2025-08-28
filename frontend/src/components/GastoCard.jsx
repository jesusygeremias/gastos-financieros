export default function GastoCard({ gasto, deleteGasto, updateGasto }) {
    return (
        <div className="card mb-2">
            <h4 className="font-semibold">{gasto.mes}</h4>
            <div>Salario: <span className="text-income">{gasto.salario.toFixed(2)} €</span></div>
            <div>Comunidad: <span className="text-expense">{gasto.comunidad.toFixed(2)} €</span></div>
            <div>Garaje: <span className="text-expense">{gasto.garaje.toFixed(2)} €</span></div>
            <div>Internet: <span className="text-expense">{gasto.internet.toFixed(2)} €</span></div>
            <div>Electricidad: <span className="text-expense">{gasto.electricidad.toFixed(2)} €</span></div>
            <div>Agua: <span className="text-expense">{gasto.agua.toFixed(2)} €</span></div>
            <div>PAC/IBI: <span className="text-expense">{gasto.pac.toFixed(2)} €</span></div>
            <div>Seguro: <span className="text-expense">{gasto.seguro.toFixed(2)} €</span></div>
            <div>Ahorro Revolut: <span className="text-expense">{gasto.revolutAhorro.toFixed(2)} €</span></div>
            <div>Corriente Revolut: <span className="text-expense">{gasto.revolutCorriente.toFixed(2)} €</span></div>
            <button className="text-red-600 mt-2" onClick={() => deleteGasto(gasto.id)}>Eliminar</button>
        </div>
    );
}
