import MesGroupList from "./MesGroupList";
import GastoCard from "./GastoCard";

export default function GastoList({ gastos, deleteGasto, updateGasto }) {
    return (
        <MesGroupList
            items={gastos}
            deleteItem={deleteGasto}
            updateItem={updateGasto}
            renderCard={(gasto, deleteItem, updateItem) => (
                <GastoCard key={gasto.id} gasto={gasto} onDelete={deleteItem} onUpdate={updateItem} />
            )}
        />
    );
}
