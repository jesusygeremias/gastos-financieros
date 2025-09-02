import { useState } from "react";
import { API_URL_CUENTAS } from "../api";
import logos from "../assets/logos";

export default function InicializacionModal({ cuentas, onClose, onImportBackup }) {
    const [montos, setMontos] = useState({});

    const handleChange = (id, value) => {
        setMontos(prev => ({ ...prev, [id]: value }));
    };

    const handleGuardar = async () => {
        for (const cuenta of cuentas) {
            if (montos[cuenta.id]) {
                await fetch(`${API_URL_CUENTAS}/${cuenta.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ saldo: parseFloat(montos[cuenta.id]) }),
                });
            }
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[650px] max-h-[90vh] flex flex-col">
                
                {/* Header con tooltip */}
                <div className="p-6 border-b rounded-t-2xl bg-indigo-50 flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-bold text-indigo-700">
                        Configurar Saldos Iniciales
                    </h2>
                    <i
                        className="fa fa-info-circle text-indigo-400 cursor-pointer"
                        title="Introduce los saldos iniciales de cada banco o importa un backup"
                    ></i>
                </div>

                {/* Lista de bancos con scroll */}
                <div className="p-6 overflow-y-auto flex-1 grid gap-4">
                    {cuentas.map(cuenta => (
                        <div
                            key={cuenta.id}
                            className="flex items-center justify-between p-4 rounded-2xl shadow border bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                {logos[cuenta.banco] && (
                                    <img
                                        src={logos[cuenta.banco]}
                                        alt={cuenta.banco}
                                        className="w-10 h-10 object-contain"
                                    />
                                )}
                                <span className="font-semibold">
                                    {cuenta.banco} ({cuenta.tipoCuenta || "Sin tipo"})
                                </span>
                            </div>
                            <input
                                type="number"
                                placeholder="Monto inicial"
                                className="border rounded-lg p-2 w-32 text-right"
                                value={montos[cuenta.id] || ""}
                                onChange={(e) => handleChange(cuenta.id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Footer fijo */}
                <div className="flex justify-between p-6 border-t rounded-b-2xl bg-white">
                    <label className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 shadow cursor-pointer">
                        Importar Backup
                        <input 
                            type="file" 
                            accept=".json" 
                            onChange={async (e) => {
                                await onImportBackup(e);
                                onClose();  // cerrar la modal después del import
                            }} 
                            className="hidden" 
                        />
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardar}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
