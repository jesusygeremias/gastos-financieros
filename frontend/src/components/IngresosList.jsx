import MesGroupList from "./MesGroupList";
import IngresoCard from "./IngresoCard";

export default function IngresosList({ ingresos, deleteIngreso, updateIngreso }) {
    return (
        <MesGroupList
            items={ingresos}
            deleteItem={deleteIngreso}
            updateItem={updateIngreso}
            renderCard={(ingreso, deleteItem, updateItem) => (
                <IngresoCard key={ingreso.id} ingreso={ingreso} onDelete={deleteItem} onUpdate={updateItem} />
            )}
        />
    );
}
