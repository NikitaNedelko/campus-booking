// src/types.ts
export type RoomType = 'all' | 'lecture' | 'computer' | 'practice';

export interface Filters {
    search: string;
    roomType: RoomType;
    hasProjector: boolean | null;
    showOnlyFree: boolean;
    date: string; // YYYY-MM-DD
}

export interface Room {
    id: string;
    code: string;     // Например: "Ж-310"
    building: string; // "Ж"
    floor: number;    // 3
    type: Exclude<RoomType, 'all'>;
    hasProjector: boolean;
}

export type PairIndex = 1 | 2 | 3 | 4 | 5 | 6;

export interface Booking {
    id: string;
    roomId: string;
    date: string;    // YYYY-MM-DD
    pair: PairIndex; // 1..6
    title?: string;  // Название занятия
    teacher?: string;
    mine?: boolean;  // моя бронь
}
