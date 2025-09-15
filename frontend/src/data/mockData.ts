// src/data/mockData.ts
import type { Room, Booking, PairIndex } from "../types/index";

export const PAIRS: { index: PairIndex; time: string }[] = [
    { index: 1, time: "09:00 - 10:30" },
    { index: 2, time: "10:45 - 12:15" },
    { index: 3, time: "12:30 - 14:00" },
    { index: 4, time: "14:15 - 15:45" },
    { index: 5, time: "16:00 - 17:30" },
    { index: 6, time: "17:45 - 19:15" },
];

export const ROOMS: Room[] = [
    { id: "r1", code: "Ж-310", building: "Ж", floor: 3, type: "lecture", hasProjector: true },
    { id: "r2", code: "Ж-311", building: "Ж", floor: 3, type: "computer", hasProjector: false },
    { id: "r3", code: "Ж-210", building: "Ж", floor: 2, type: "practice", hasProjector: true },
];

export function todayISO(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
}

export const BOOKINGS: Booking[] = [
    { id: "b1", roomId: "r1", date: todayISO(0), pair: 1, title: "Системный анализ", teacher: "Смирнов А.В." },
    { id: "b2", roomId: "r2", date: todayISO(0), pair: 1, title: "Лекции (комп.)", teacher: "Козлов К.К.", mine: true },
    { id: "b3", roomId: "r1", date: todayISO(0), pair: 6, title: "Программирование", teacher: "Смирнов А.В." },
];
