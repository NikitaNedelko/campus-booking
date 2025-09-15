import { useEffect, useState } from 'react';
import { Filters, Booking } from './types';
import { generateMockBookings } from './data/mockData';
import SearchAndFilters from './components/SearchAndFilters';
import ScheduleTable from './components/ScheduleTable';

export default function App() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    roomType: 'all',
    date: new Date().toISOString().split('T')[0],
    hasProjector: null,
    showOnlyFree: false
  });

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(generateMockBookings(filters.date));
  }, [filters.date]);

  const onChange = (patch: Partial<Filters>) => setFilters(prev => ({ ...prev, ...patch }));
  const onReset = () => setFilters({
    search: '', roomType: 'all',
    date: new Date().toISOString().split('T')[0],
    hasProjector: null, showOnlyFree: false
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Система бронирования кабинетов МЭИ</h1>
      <p className="text-zinc-600 mb-6">Найдите и забронируйте кабинет для ваших занятий.</p>

      <SearchAndFilters filters={filters} onChange={onChange} onReset={onReset} />
      <ScheduleTable bookings={bookings} filters={filters} />
    </div>
  );
}
