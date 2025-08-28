export default function SaldosPorCuenta({ data, saldoTotal }) {
    const logos = {
        "ActivoBank": "/logos/activobank.png",
        "Openbank": "/logos/openbank.png",
        "Revolut": "/logos/revolut.png",
        "Pluxee": "/logos/pluxee.png"
        // añadir más bancos según necesites
    };

    const formatMonto = (monto) => {
        return monto.toFixed(2) + " €";
    };

    const colorMonto = (monto) => {
        if (monto > 0) return "text-green-600";
        if (monto < 0) return "text-red-600";
        return "text-gray-800";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.map(c => (
                <div 
                    key={c.id} 
                    className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex items-center gap-4"
                >
                    {/* Logo a la izquierda */}
                    {logos[c.banco] && (
                        <img
                            src={logos[c.banco]}
                            alt={c.banco}
                            className="w-16 h-16 object-contain flex-shrink-0"
                        />
                    )}

                    {/* Contenido: título + saldo */}
                    <div className="flex flex-col justify-center">
                        <span className="text-lg font-semibold text-indigo-600">{c.cuenta}</span>
                        <span className={`text-2xl font-extrabold mt-2 ${colorMonto(c.monto)}`}>
                            {formatMonto(c.monto)}
                        </span>
                    </div>
                </div>
            ))}

            {/* Caja de saldo total */}
            <div className="p-6 rounded-2xl shadow-md flex flex-col justify-center items-center"
                 style={{ backgroundColor: saldoTotal >= 0 ? "#ECFDF5" : "#FEE2E2" }}>
                <span className={`text-lg font-bold ${saldoTotal >= 0 ? "text-green-700" : "text-red-700"}`}>
                    Saldo total disponible
                </span>
                <span className={`text-2xl font-extrabold mt-2 ${saldoTotal >= 0 ? "text-green-800" : "text-red-800"}`}>
                    {formatMonto(saldoTotal)}
                </span>
            </div>
        </div>
    );
}
