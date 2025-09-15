export function parseQuery(q: string) {
    const s = q.trim().toUpperCase();
    if (!s) return null;

    // Ж-310 → { building:'Ж', floor:3, room:'10' }
    let m = s.match(/^([А-ЯЁ])-(\d)(\d{2})$/);
    if (m) return { building: m[1], floor: Number(m[2]), room: m[3] };

    // Ж-3 → { building:'Ж', floor:3 }
    m = s.match(/^([А-ЯЁ])-(\d)$/);
    if (m) return { building: m[1], floor: Number(m[2]) };

    // Ж → { building:'Ж' }
    m = s.match(/^([А-ЯЁ])$/);
    if (m) return { building: m[1] };

    return null;
}
