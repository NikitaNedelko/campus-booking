// src/App.tsx
import { useMemo, useState } from "react";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { ScheduleTable } from "./components/ScheduleTable";
import type { Filters } from "./types";
import { BOOKINGS, ROOMS, todayISO } from "./data/mockData";
import { parseRoomQuery } from "./lib/parseQuery";
import { Card } from "./components/ui/card";
import { Icons } from "./components/ui/icons";

const defaultFilters: Filters = {
  search: "",
  roomType: "all",
  hasProjector: null,
  showOnlyFree: false,
  date: todayISO(0),
};

export default function App() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filteredRooms = useMemo(() => {
    const q = parseRoomQuery(filters.search);
    return ROOMS.filter((r) => {
      if (filters.roomType !== "all" && r.type !== filters.roomType) return false;
      if (filters.hasProjector !== null && r.hasProjector !== filters.hasProjector) return false;

      // парсер
      if ("text" in q) {
        const t = q.text.toLowerCase();
        if (!(r.code.toLowerCase().includes(t) || r.building.toLowerCase().includes(t))) return false;
      } else {
        if (q.building && r.building !== q.building) return false;
        if (q.floor != null && r.floor !== q.floor) return false;
        if (q.room != null && Number(String(r.floor) + String(q.room).padStart(2, "0")) !== Number(r.code.split("-")[1])) return false;
      }

      if (filters.showOnlyFree) {
        // свободна ли комната хотя бы в одной паре на выбранную дату
        const anyBusy = BOOKINGS.some(b => b.roomId === r.id && b.date === filters.date);
        if (anyBusy && BOOKINGS.filter(b => b.roomId === r.id && b.date === filters.date).length === 6) return false;
      }
      return true;
    });
  }, [filters]);

  // простые метрики
  const myBookings = BOOKINGS.filter(b => b.mine && b.date === filters.date);
  const freeSlotsCount = filteredRooms.reduce((acc, r) => {
    const busyPairs = BOOKINGS.filter(b => b.roomId === r.id && b.date === filters.date).length;
    return acc + (6 - busyPairs);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="text-center space-y-1">
        <h1 className="text-3xl font-bold">Система бронирования кабинетов МЭИ</h1>
        <p className="text-muted-foreground">Найдите и забронируйте кабинет для ваших занятий</p>
      </header>

      <SearchAndFilters filters={filters} onFiltersChange={setFilters} />

      {/* Инфо-панель */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <Icons.MapPin className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm text-muted-foreground">Кабинетов найдено</div>
            <div className="font-semibold text-lg">{filteredRooms.length}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Icons.Clock className="h-5 w-5 text-green-600" />
          <div>
            <div className="text-sm text-muted-foreground">Свободных слотов</div>
            <div className="font-semibold text-lg">{freeSlotsCount}</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Icons.CalendarDays className="h-5 w-5 text-blue-600" />
          <div>
            <div className="text-sm text-muted-foreground">Моих броней</div>
            <div className="font-semibold text-lg">{myBookings.length}</div>
          </div>
        </Card>
      </div>

      <ScheduleTable rooms={filteredRooms} bookings={BOOKINGS} filters={filters} />
    </div>
  );
}
