import { Filters } from '../types';

type Props = {
    filters: Filters;
    onChange: (patch: Partial<Filters>) => void;
    onReset: () => void;
};

export default function SearchAndFilters({ filters, onChange, onReset }: Props) {
    return (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center">
            <input
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-300"
                placeholder="Поиск кабинета: Ж-310 (кабинет), Ж-3 (этаж), Ж (корпус)"
                value={filters.search}
                onChange={e => onChange({ search: e.target.value })}
            />

            <select
                className="border rounded-md px-3 py-2"
                value={filters.roomType}
                onChange={e => onChange({ roomType: e.target.value as Filters['roomType'] })}
            >
                <option value="all">Все типы</option>
                <option value="Лекц.">Лекционные</option>
                <option value="Комп.">Комп. классы</option>
                <option value="Практ.">Практика</option>
            </select>

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={filters.hasProjector === true}
                    onChange={e => onChange({ hasProjector: e.target.checked ? true : null })}
                />
                Есть проектор
            </label>

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={filters.showOnlyFree}
                        onChange={e => onChange({ showOnlyFree: e.target.checked })}
                    />
                    Показать только свободные
                </label>
                <button className="border rounded-md px-3 py-2 hover:bg-zinc-50" onClick={onReset}>Сбросить</button>
            </div>
        </div>
    );
}
