import { Booking, Room } from '../types';

export const rooms: Room[] = [
    { id: 'r1', code: 'Ж-310', building: 'Ж', floor: 3, type: 'Лекц.', capacity: 120, hasProjector: true },
    { id: 'r2', code: 'Ж-311', building: 'Ж', floor: 3, type: 'Комп.', capacity: 24, hasProjector: false },
    { id: 'r3', code: 'Ж-210', building: 'Ж', floor: 2, type: 'Практ.', capacity: 30, hasProjector: true },
];

export const timeSlots = [
    { pair: 1, time: '09:00–10:30' },
    { pair: 2, time: '10:45–12:15' },
    { pair: 3, time: '12:30–14:00' },
    { pair: 4, time: '14:15–15:45' },
    { pair: 5, time: '16:00–17:30' },
    { pair: 6, time: '17:45–19:15' },
];

export function generateMockBookings(date: string): Booking[] {
    return [
        { id: 'b1', roomId: 'r1', pair: 1, date, title: 'Системный анализ', teacher: 'Смирнов А.В.' },
        { id: 'b2', roomId: 'r2', pair: 4, date, title: 'Дискретная математика', teacher: 'Козлов К.К.' },
        { id: 'b3', roomId: 'r1', pair: 6, date, title: 'Программирование', teacher: 'Смирнов А.В.', isMine: true },
    ];
}
