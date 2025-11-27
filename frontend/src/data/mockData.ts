import { Room, TimeSlot, Booking } from '../types';

export const rooms: Room[] = [
  { id: '1', name: 'Ж-310', building: 'Ж', floor: 3, roomNumber: 10, type: 'lecture', hasProjector: true, capacity: 120 },
  { id: '2', name: 'Ж-311', building: 'Ж', floor: 3, roomNumber: 11, type: 'computer', hasProjector: true, capacity: 24 },
  { id: '3', name: 'Ж-312', building: 'Ж', floor: 3, roomNumber: 12, type: 'practice', hasProjector: false, capacity: 30 },
  { id: '4', name: 'А-205', building: 'А', floor: 2, roomNumber: 5, type: 'lecture', hasProjector: true, capacity: 80 },
  { id: '5', name: 'А-206', building: 'А', floor: 2, roomNumber: 6, type: 'computer', hasProjector: true, capacity: 20 },
  { id: '6', name: 'Б-410', building: 'Б', floor: 4, roomNumber: 10, type: 'practice', hasProjector: false, capacity: 25 },
  { id: '7', name: 'В-101', building: 'В', floor: 1, roomNumber: 1, type: 'lecture', hasProjector: true, capacity: 150 },
  { id: '8', name: 'В-102', building: 'В', floor: 1, roomNumber: 2, type: 'computer', hasProjector: true, capacity: 30 },
  { id: '9', name: 'Г-508', building: 'Г', floor: 5, roomNumber: 8, type: 'practice', hasProjector: false, capacity: 20 },
  { id: '10', name: 'Д-301', building: 'Д', floor: 3, roomNumber: 1, type: 'lecture', hasProjector: true, capacity: 100 },
];

export const timeSlots: TimeSlot[] = [
  { id: '1', startTime: '09:20', endTime: '10:50', pairNumber: 1 },
  { id: '2', startTime: '11:10', endTime: '12:45', pairNumber: 2 },
  { id: '3', startTime: '13:45', endTime: '15:20', pairNumber: 3 },
  { id: '4', startTime: '15:35', endTime: '17:10', pairNumber: 4 },
  { id: '5', startTime: '17:20', endTime: '18:50', pairNumber: 5 },
  { id: '6', startTime: '19:00', endTime: '20:30', pairNumber: 6 },
];

export const generateMockBookings = (selectedDate: string): Booking[] => {
  const bookings: Booking[] = [];

  rooms.forEach((room) => {
    timeSlots.forEach((slot) => {
      // Генерируем случайные брони для демонстрации
      const random = Math.random();
      if (random < 0.4) { // 40% занятых слотов
        const isMyBooking = random < 0.1; // 10% моих броней
        bookings.push({
          id: `${room.id}-${slot.id}-${selectedDate}`,
          roomId: room.id,
          timeSlotId: slot.id,
          date: selectedDate,
          subject: isMyBooking ? 'Моя лекция' : getRandomSubject(),
          teacher: isMyBooking ? 'Вы' : getRandomTeacher(),
          isMyBooking,
          status: isMyBooking ? 'my-booking' : 'occupied',
        });
      } else {
        bookings.push({
          id: `${room.id}-${slot.id}-${selectedDate}`,
          roomId: room.id,
          timeSlotId: slot.id,
          date: selectedDate,
          subject: '',
          teacher: '',
          isMyBooking: false,
          status: 'free',
        });
      }
    });
  });

  return bookings;
};

const subjects = [
  'Математический анализ',
  'Физика',
  'Программирование',
  'База данных',
  'Электротехника',
  'Теория вероятностей',
  'Дискретная математика',
  'Системный анализ',
];

const teachers = [
  'Иванов И.И.',
  'Петров П.П.',
  'Сидоров С.С.',
  'Козлов К.К.',
  'Смирнов А.В.',
  'Морозов М.М.',
];

function getRandomSubject(): string {
  return subjects[Math.floor(Math.random() * subjects.length)];
}

function getRandomTeacher(): string {
  return teachers[Math.floor(Math.random() * teachers.length)];
}