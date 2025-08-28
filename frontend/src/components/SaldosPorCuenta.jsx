export default function SaldosPorCuenta({ data, saldoTotal }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {data.map((c) => (
                <div key={c.cuenta} className="card">
                    <h3 className="text-lg font-semibold">{c.cuenta}</h3>
                    <p className="text-balance font-bold text-xl">{c.monto.toFixed(2)} €</p>
                </div>
            ))}
            <div className="card">
                <h3 className="text-lg font-semibold">Saldo total disponible</h3>
                <p className="text-income font-bold text-xl">{saldoTotal.toFixed(2)} €</p>
            </div>
        </div>
    );
}
