export default function IngresoCard({ ingreso, onDelete }) {
    const formatMonto = (monto) => monto.toFixed(2) + " €";

    const getColor = (monto) => {
        if (monto > 0) return "text-green-600";
        if (monto < 0) return "text-red-600";
        return "text-gray-800";
    };

    return (
        <div className="p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition duration-300 relative">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <i className="fa fa-coins mr-2 text-yellow-500"></i>
                {ingreso.descripcion}
            </h3>
            <p className={`text-xl font-bold ${getColor(ingreso.monto)}`}>
                {formatMonto(ingreso.monto)}
            </p>
            {ingreso.cuenta && (
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <i className="fa fa-university mr-1 text-indigo-400"></i>
                    {ingreso.cuenta.banco} ({ingreso.cuenta.tipoCuenta || "N/A"})
                </p>
            )}
            <button
                onClick={() => onDelete(ingreso.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
            >
                <i className="fa fa-trash"></i>
            </button>
        </div>
    );
}
