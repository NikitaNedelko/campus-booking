// src/components/ScheduleTable.tsx
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Icons } from "../components/ui/icons";
import type { Booking, Filters, Room } from "../types";
import { PAIRS } from "../data/mockData";

interface Props {
    rooms: Room[];
    bookings: Booking[];
    filters: Filters;
}

function cellState(roomId: string, date: string, pair: number, bookings: Booking[]) {
    const b = bookings.find(x => x.roomId === roomId && x.date === date && x.pair === pair);
    if (!b) return { status: "free" as const };
    return { status: b.mine ? "mine" as const : "busy" as const, booking: b };
}

export function ScheduleTable({ rooms, bookings, filters }: Props) {
    return (
        <Card className="p-0 overflow-auto">
            <div className="min-w-[900px]">
                {/* Header */}
                <div className="sticky top-0 z-10 grid grid-cols-[200px_repeat(6,1fr)] bg-white border-b">
                    <div className="px-4 py-3 font-medium">Кабинет</div>
                    {PAIRS.map(p => (
                        <div key={p.index} className="px-4 py-3 text-center font-medium">{p.index} пара<br /><span className="text-xs text-muted-foreground">{p.time}</span></div>
                    ))}
                </div>

                {/* Rows */}
                {rooms.map((r) => (
                    <div key={r.id} className="grid grid-cols-[200px_repeat(6,1fr)] border-b">
                        {/* Left col */}
                        <div className="px-4 py-3 bg-white sticky left-0 z-10 border-r flex items-center gap-2">
                            <div className="font-medium">{r.code}</div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                                {r.type === "computer" && <Badge variant="secondary" className="gap-1"><Icons.Monitor className="h-3 w-3" /> Комн.</Badge>}
                                {r.type === "lecture" && <Badge variant="secondary" className="gap-1">Лекц.</Badge>}
                                {r.type === "practice" && <Badge variant="secondary" className="gap-1">Практ.</Badge>}
                                {r.hasProjector && <Badge variant="outline" className="gap-1"><Icons.Projector className="h-3 w-3" /> Проектор</Badge>}
                            </div>
                        </div>

                        {/* Cells */}
                        {PAIRS.map((p) => {
                            const st = cellState(r.id, filters.date, p.index, bookings);
                            const base = "px-4 py-3 text-sm border-r cursor-pointer";
                            if (st.status === "free") {
                                return <div key={p.index} className={base + " bg-green-50 hover:bg-green-100"}>Свободно</div>;
                            }
                            if (st.status === "mine") {
                                return <div key={p.index} className={base + " bg-blue-50 hover:bg-blue-100"}>
                                    <div className="font-medium">Моя бронь</div>
                                    <div className="text-xs text-muted-foreground">{st.booking?.title}</div>
                                </div>;
                            }
                            return <div key={p.index} className={base + " bg-red-50 hover:bg-red-100"}>
                                <div className="font-medium">{st.booking?.title}</div>
                                <div className="text-xs text-muted-foreground">{st.booking?.teacher}</div>
                            </div>;
                        })}
                    </div>
                ))}
            </div>
        </Card>
    );
}
