import { rooms as allRooms, timeSlots } from '../data/mockData';
import { Booking, Filters, Room } from '../types';
import { parseQuery } from '../lib/parseQuery';

function byFilters(rooms: Room[], filters: Filters, bookings: Booking[]) {
    const q = filters.search.trim().toUpperCase();
    const parsed = parseQuery(q);

    // посчитаем, у каких комнат есть свободные слоты (для "Показать только свободные")
    const busyByRoom = new Map<string, number>();
    bookings.forEach(b => busyByRoom.set(b.roomId, (busyByRoom.get(b.roomId) || 0) + 1));

    return rooms.filter(r => {
        if (filters.roomType !== 'all' && r.type !== filters.roomType) return false;
        if (filters.hasProjector === true && !r.hasProjector) return false;

        if (parsed) {
            if (parsed.building && r.building.toUpperCase() !== parsed.building) return false;
            if (typeof parsed.floor === 'number' && r.floor !== parsed.floor) return false;
            if (parsed.room && !r.code.endsWith(parsed.room)) return false;
        } else if (q) {
            // fallback: простая подстрока
            if (!r.code.toUpperCase().includes(q)) return false;
        }

        if (filters.showOnlyFree) {
            const busy = busyByRoom.get(r.id) || 0;
            // показываем, если есть хотя бы 1 свободный слот из 6
            if (busy >= timeSlots.length) return false;
        }
        return true;
    });
}

export default function ScheduleTable({ bookings, filters }: { bookings: Booking[]; filters: Filters; }) {
    const rooms = byFilters(allRooms, filters, bookings);
    const map = new Map<string, Booking>();
    bookings.forEach(b => map.set(`${b.roomId}-${b.pair}`, b));

    const freeSlots = rooms.reduce((acc, r) => {
        const busyCount = timeSlots.filter(s => map.has(`${r.id}-${s.pair}`)).length;
        return acc + (timeSlots.length - busyCount);
    }, 0);

    return (
        <div className="mt-6">
            {/* карточки-метрики */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border rounded-xl p-4">
                    <div className="text-sm text-zinc-500">Кабинетов найдено</div>
                    <div className="text-3xl font-semibold">{rooms.length}</div>
                </div>
                <div className="border rounded-xl p-4">
                    <div className="text-sm text-zinc-500">Свободных слотов</div>
                    <div className="text-3xl font-semibold">{freeSlots}</div>
                </div>
                <div className="border rounded-xl p-4">
                    <div className="text-sm text-zinc-500">Моих броней</div>
                    <div className="text-3xl font-semibold">{bookings.filter(b => b.isMine).length}</div>
                </div>
            </div>

            {/* легенда */}
            <div className="flex gap-3 items-center mb-2">
                <span className="px-2 py-1 rounded badge-free text-sm">Свободно</span>
                <span className="px-2 py-1 rounded badge-busy text-sm">Занято</span>
                <span className="px-2 py-1 rounded badge-mine text-sm">Моя бронь</span>
            </div>

            {/* таблица */}
            <div className="grid border rounded-xl overflow-x-auto">
                {/* заголовок */}
                <div className="grid grid-cols-7 sticky top-0 bg-white border-b">
                    <div className="p-3 font-medium">Кабинет</div>
                    {timeSlots.map(s => (
                        <div key={s.pair} className="p-3 text-sm text-zinc-600">
                            {s.pair} пара<br />{s.time}
                        </div>
                    ))}
                </div>

                {/* строки комнат */}
                {rooms.map(r => (
                    <div key={r.id} className="grid grid-cols-7 border-b">
                        <div className="p-3">
                            <div className="font-medium">{r.code}</div>
                            <div className="text-xs text-zinc-500">{r.type} • до {r.capacity} мест</div>
                        </div>

                        {timeSlots.map(s => {
                            const b = map.get(`${r.id}-${s.pair}`);
                            const cls = b ? (b.isMine ? 'badge-mine' : 'badge-busy') : 'badge-free';
                            return (
                                <div key={s.pair} className="p-2 flex items-center justify-center cursor-default">
                                    <span className={`px-2 py-1 rounded ${cls}`}>
                                        {b ? (b.isMine ? 'Моя бронь' : 'Занято') : 'Свободно'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
