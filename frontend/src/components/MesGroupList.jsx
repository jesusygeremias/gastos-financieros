import { useState, useRef, useEffect } from "react";

export default function MesGroupList({ items, deleteItem, updateItem, renderCard }) {
    const [expandedMonths, setExpandedMonths] = useState({});
    const containersRef = useRef({});

    const itemsPorMes = items.reduce((acc, item) => {
        const key = `${item.mes} ${item.anio}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const toggleMonth = (mesKey) => {
        setExpandedMonths(prev => ({ ...prev, [mesKey]: !prev[mesKey] }));
    };

    useEffect(() => {
        Object.entries(expandedMonths).forEach(([mesKey, isExpanded]) => {
            const container = containersRef.current[mesKey];
            if (container) {
                container.style.maxHeight = isExpanded ? `${container.scrollHeight}px` : "0px";
            }
        });
    }, [expandedMonths, items]);

    return (
        <div className="space-y-4">
            {Object.entries(itemsPorMes).map(([mesKey, itemsMes]) => {
                const totalMes = itemsMes.reduce((sum, g) => sum + g.monto, 0);
                const isExpanded = expandedMonths[mesKey] || false;

                return (
                    <div key={mesKey} className="bg-white rounded-2xl shadow-md p-4 transition-shadow duration-300 hover:shadow-lg">
                        {/* Header con total y papelera */}
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMonth(mesKey)}>
                            <span className="font-semibold text-lg">{mesKey}</span>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold ${totalMes > 0 ? "text-green-600" : totalMes < 0 ? "text-red-600" : ""}`}>
                                    {totalMes.toFixed(2)} €
                                </span>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={async (e) => {
                                        e.stopPropagation(); // evita toggle
                                        for (const i of itemsMes) {
                                            await deleteItem(i.id);
                                        }
                                    }}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        {/* Contenedor de items */}
                        <div
                            ref={el => (containersRef.current[mesKey] = el)}
                            className="overflow-hidden transition-all duration-500 ease-in-out"
                            style={{ maxHeight: isExpanded ? `${itemsMes.length * 160}px` : "0px" }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {itemsMes.map(item => renderCard(item, deleteItem, updateItem))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
