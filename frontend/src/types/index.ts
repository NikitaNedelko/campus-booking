export type RoomType = 'Лекц.' | 'Комп.' | 'Практ.';

export type Room = {
    id: string;
    code: string;           // Ж-310
    building: string;       // Ж
    floor: number;          // 3
    type: RoomType;
    capacity: number;
    hasProjector: boolean;
};

export type Booking = {
    id: string;
    roomId: string;
    pair: 1 | 2 | 3 | 4 | 5 | 6;      // номер пары
    date: string;           // YYYY-MM-DD
    title?: string;
    teacher?: string;
    isMine?: boolean;       // пометка «моя бронь»
};

export type Filters = {
    search: string;                 // Ж-310 | Ж-3 | Ж
    roomType: 'all' | RoomType;
    date: string;                   // выбранный день
    hasProjector: boolean | null;     // true — фильтровать только с проектором; null — игнор
    showOnlyFree: boolean;          // показывать только аудитории с свободными слотами
};
