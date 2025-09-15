// src/lib/parseQuery.ts
export type RoomQuery =
    | { building: string; floor?: number; room?: number }
    | { text: string };

export function parseRoomQuery(raw: string): RoomQuery {
    const s = raw.trim().toUpperCase().replace(/\s+/g, '');

    const mFull = /^([А-ЯA-Z])-(\d)(\d{2})$/.exec(s);
    if (mFull) return { building: mFull[1], floor: +mFull[2], room: +mFull[3] };

    const mFloor = /^([А-ЯA-Z])-(\d)$/.exec(s);
    if (mFloor) return { building: mFloor[1], floor: +mFloor[2] };

    const mBuilding = /^([А-ЯA-Z])$/.exec(s);
    if (mBuilding) return { building: mBuilding[1] };

    return { text: raw };
}
