import React, { useState } from 'react';
import { Monitor, Projector } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Room, TimeSlot, Booking } from '../types';
import { BookingModal } from './BookingModal';
import { RoomHighlight } from './RoomHighlight';

interface ScheduleTableProps {
  rooms: Room[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  searchQuery?: string;
  selectedDate: string;
  onBookingUpdate: (booking: Partial<Booking>) => void;
  onBookingDelete: (bookingId: string) => void;
}

export function ScheduleTable({ 
  rooms, 
  timeSlots, 
  bookings, 
  searchQuery = '',
  selectedDate,
  onBookingUpdate, 
  onBookingDelete 
}: ScheduleTableProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    room: Room | null;
    timeSlot: TimeSlot | null;
    booking: Booking | null;
  }>({
    isOpen: false,
    room: null,
    timeSlot: null,
    booking: null,
  });

  const getBooking = (roomId: string, timeSlotId: string): Booking | undefined => {
    return bookings.find(b => b.roomId === roomId && b.timeSlotId === timeSlotId);
  };

  const getCellClass = (booking: Booking | undefined): string => {
    if (!booking) return 'bg-green-50 hover:bg-green-100 cursor-pointer border border-green-200';
    
    switch (booking.status) {
      case 'free':
        return 'bg-green-50 hover:bg-green-100 cursor-pointer border border-green-200';
      case 'occupied':
        return 'bg-red-50 hover:bg-red-100 cursor-pointer border border-red-200';
      case 'my-booking':
        return 'bg-blue-50 hover:bg-blue-100 cursor-pointer border border-blue-200';
      default:
        return 'bg-green-50 hover:bg-green-100 cursor-pointer border border-green-200';
    }
  };

  const handleCellClick = (room: Room, timeSlot: TimeSlot) => {
    const booking = getBooking(room.id, timeSlot.id);
    
    // Если слот занят не мной, не открываем модальное окно
    if (booking && booking.status === 'occupied' && !booking.isMyBooking) {
      return;
    }
    
    setModalState({
      isOpen: true,
      room,
      timeSlot,
      booking: booking || null,
    });
  };

  const handleBookingSave = (bookingData: Partial<Booking>) => {
    onBookingUpdate(bookingData);
  };

  const handleBookingDelete = () => {
    if (modalState.booking) {
      onBookingDelete(modalState.booking.id);
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      room: null,
      timeSlot: null,
      booking: null,
    });
  };

  return (
    <>
      <div className="border rounded-lg overflow-auto max-h-[600px]">
        <Table>
          <TableHeader className="sticky top-0 z-20">
            <TableRow>
              <TableHead className="w-48 sticky left-0 bg-background z-30 border-r">
                Кабинет
              </TableHead>
              {timeSlots.map((slot) => (
                <TableHead key={slot.id} className="text-center min-w-32 bg-background">
                  <div>
                    <div className="font-medium">{slot.pairNumber} пара</div>
                    <div className="text-xs text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="sticky left-0 bg-background z-10 border-r shadow-sm">
                  <div className="space-y-1">
                    <div className="font-medium">
                      <RoomHighlight roomName={room.name} searchQuery={searchQuery} />
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {room.type === 'lecture' && 'Лекц.'}
                        {room.type === 'computer' && 'Комп.'}
                        {room.type === 'practice' && 'Практ.'}
                      </Badge>
                      {room.hasProjector && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="text-xs">
                                <Projector className="h-3 w-3" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Есть проектор</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {room.type === 'computer' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="text-xs">
                                <Monitor className="h-3 w-3" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Компьютерный класс</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      До {room.capacity} мест
                    </div>
                  </div>
                </TableCell>
                {timeSlots.map((slot) => {
                  const booking = getBooking(room.id, slot.id);
                  return (
                    <TableCell
                      key={slot.id}
                      className={`p-2 h-20 ${getCellClass(booking)}`}
                      onClick={() => handleCellClick(room, slot)}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              {booking && booking.status !== 'free' ? (
                                <div className="space-y-1">
                                  <div className="text-xs font-medium truncate">
                                    {booking.subject}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {booking.teacher}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">
                                  Свободно
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {booking && booking.status !== 'free' ? (
                              <div>
                                <p className="font-medium">{booking.subject}</p>
                                <p className="text-sm">Преподаватель: {booking.teacher}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {booking.isMyBooking ? 
                                    'Нажмите для редактирования' : 
                                    'Время занято'
                                  }
                                </p>
                              </div>
                            ) : (
                              <p>Нажмите для бронирования</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BookingModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        room={modalState.room}
        timeSlot={modalState.timeSlot}
        booking={modalState.booking}
        selectedDate={selectedDate}
        onSave={handleBookingSave}
        onDelete={modalState.booking?.isMyBooking ? handleBookingDelete : undefined}
      />
    </>
  );
}