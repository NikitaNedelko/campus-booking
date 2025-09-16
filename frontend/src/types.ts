export interface Room {
  id: string;
  name: string;
  building: string;
  floor: number;
  roomNumber: number;
  type: 'lecture' | 'computer' | 'practice';
  hasProjector: boolean;
  capacity: number;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  pairNumber: number;
}

export interface Booking {
  id: string;
  roomId: string;
  timeSlotId: string;
  date: string;
  subject: string;
  teacher: string;
  isMyBooking: boolean;
  status: 'occupied' | 'free' | 'my-booking';
}

export interface Filters {
  search: string;
  roomType: string;
  date: string;
  hasProjector: boolean | null;
  showOnlyFree: boolean;
}