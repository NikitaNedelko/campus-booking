import React, { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Clock, MapPin, LogOut, User } from 'lucide-react';
import { SearchAndFilters } from './SearchAndFilters';
import { ScheduleTable } from './ScheduleTable';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { rooms, timeSlots, generateMockBookings } from '../data/mockData';
import { Filters, Booking, Room } from '../types';

interface BookingSystemProps {
  user: { username: string; password: string };
  onLogout: () => void;
}

export function BookingSystem({ user, onLogout }: BookingSystemProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    roomType: 'all',
    date: new Date().toISOString().split('T')[0],
    hasProjector: null,
    showOnlyFree: false,
  });

  const [bookings, setBookings] = useState<Booking[]>([]);

  // Генерируем брони при изменении даты
  useEffect(() => {
    const mockBookings = generateMockBookings(filters.date);
    setBookings(mockBookings);
  }, [filters.date]);

  // Парсинг поискового запроса  
  const parseSearchQuery = (query: string) => {
    if (!query) return null;
    
    const trimmed = query.trim().toUpperCase();
    
    // Полное название кабинета (например, Ж-310)
    const fullRoomMatch = trimmed.match(/^([А-Я])-(\d+)$/);
    if (fullRoomMatch) {
      const [, building, roomNum] = fullRoomMatch;
      const floor = Math.floor(parseInt(roomNum) / 100);
      return {
        type: 'full',
        building,
        floor,
        roomNumber: parseInt(roomNum) % 100,
        fullName: trimmed
      };
    }
    
    // Этаж корпуса (например, Ж-3)
    const floorMatch = trimmed.match(/^([А-Я])-(\d)$/);
    if (floorMatch) {
      const [, building, floor] = floorMatch;
      return {
        type: 'floor',
        building,
        floor: parseInt(floor)
      };
    }
    
    // Только корпус (например, Ж)
    const buildingMatch = trimmed.match(/^([А-Я])$/);
    if (buildingMatch) {
      return {
        type: 'building',
        building: buildingMatch[1]
      };
    }
    
    // Обычный поиск по подстроке
    return {
      type: 'substring',
      query: trimmed
    };
  };

  // Фильтрация кабинетов
  const filteredRooms = useMemo<Room[]>(() => {
    return rooms.filter(room => {
      // Парсинг и поиск
      if (filters.search) {
        const searchParams = parseSearchQuery(filters.search);
        if (searchParams) {
          switch (searchParams.type) {
            case 'full':
              if (room.name.toUpperCase() !== searchParams.fullName) {
                return false;
              }
              break;
            case 'floor':
              if (room.building !== searchParams.building || room.floor !== searchParams.floor) {
                return false;
              }
              break;
            case 'building':
              if (room.building !== searchParams.building) {
                return false;
              }
              break;
            case 'substring':
              if (!room.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
              }
              break;
          }
        }
      }

      // Фильтр по типу
      if (filters.roomType !== 'all' && room.type !== filters.roomType) {
        return false;
      }

      // Фильтр по проектору
      if (filters.hasProjector === true && !room.hasProjector) {
        return false;
      }

      // Показать только свободные
      if (filters.showOnlyFree) {
        const roomBookings = bookings.filter(b => b.roomId === room.id);
        const hasFreSlots = roomBookings.some(b => b.status === 'free');
        if (!hasFreSlots) {
          return false;
        }
      }

      return true;
    });
  }, [rooms, filters, bookings]);

  const handleBookingUpdate = (bookingData: Partial<Booking>) => {
    const bookingId = `${bookingData.roomId}-${bookingData.timeSlotId}-${filters.date}`;
    
    setBookings(prev => {
      const existingBookingIndex = prev.findIndex(b => b.id === bookingId);
      
      if (existingBookingIndex >= 0) {
        // Обновляем существующую бронь
        const updated = [...prev];
        updated[existingBookingIndex] = {
          ...prev[existingBookingIndex],
          ...bookingData,
          id: bookingId,
          date: filters.date,
        };
        return updated;
      } else {
        // Создаем новую бронь
        const newBooking: Booking = {
          id: bookingId,
          roomId: bookingData.roomId!,
          timeSlotId: bookingData.timeSlotId!,
          date: filters.date,
          subject: bookingData.subject || '',
          teacher: bookingData.teacher || '',
          isMyBooking: bookingData.isMyBooking || false,
          status: bookingData.status || 'my-booking',
        };
        return [...prev, newBooking];
      }
    });
  };

  const handleBookingDelete = (bookingId: string) => {
    setBookings(prev => {
      const updated = prev.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            subject: '',
            teacher: '',
            isMyBooking: false,
            status: 'free' as const,
          };
        }
        return booking;
      });
      return updated;
    });
  };

  const stats = useMemo(() => {
    const roomsFound = filteredRooms.length;
    const freeSlots = bookings.filter(b => b.status === 'free' && 
      filteredRooms.some(r => r.id === b.roomId)).length;
    const myBookings = bookings.filter(b => b.isMyBooking && 
      filteredRooms.some(r => r.id === b.roomId)).length;
    
    return { roomsFound, freeSlots, myBookings };
  }, [filteredRooms, bookings, timeSlots]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок с кнопкой выхода */}
        <div className="flex items-center justify-between">
          <div className="text-center space-y-2 flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              Система бронирования кабинетов МЭИ
            </h1>
            <p className="text-muted-foreground">
              Найдите и забронируйте кабинет для ваших занятий
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.username}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <SearchAndFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
        />

        {/* Инфо-панель */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Кабинетов найдено</p>
                <p className="text-2xl font-bold">{stats.roomsFound}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Свободных слотов</p>
                <p className="text-2xl font-bold text-green-600">{stats.freeSlots}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Моих броней</p>
                <p className="text-2xl font-bold text-blue-600">{stats.myBookings}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Легенда цветов:</p>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Свободно</Badge>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Занято</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Моя бронь</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Таблица расписания */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Расписание на {new Date(filters.date).toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <p className="text-sm text-muted-foreground">
                Нажмите на ячейку для бронирования или редактирования
              </p>
            </div>
            
            <ScheduleTable
              rooms={filteredRooms}
              timeSlots={timeSlots}
              bookings={bookings}
              searchQuery={filters.search}
              selectedDate={filters.date}
              onBookingUpdate={handleBookingUpdate}
              onBookingDelete={handleBookingDelete}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}