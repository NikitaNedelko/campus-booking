// src/components/SearchAndFilters.tsx
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Icons } from "../components/ui/icons";
import type { Filters } from "../types/index";

interface Props {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
}

export function SearchAndFilters({ filters, onFiltersChange }: Props) {
    const updateFilter = (key: keyof Filters, value: any) =>
        onFiltersChange({ ...filters, [key]: value });

    const getRelativeDate = (daysOffset: number): string => {
        const date = new Date();
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split('T')[0];
    };

    const getDateLabel = (dateString: string): string => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = getRelativeDate(-1);
        const tomorrow = getRelativeDate(1);
        if (dateString === yesterday) return 'Вчера';
        if (dateString === today) return 'Сегодня';
        if (dateString === tomorrow) return 'Завтра';
        return new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    return (
        <Card className="p-6 mb-6">
            <div className="space-y-4">
                {/* Поиск */}
                <div className="relative">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Поиск кабинета: Ж-310 (кабинет), Ж-3 (этаж), Ж (корпус)"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Фильтры */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Icons.Funnel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Фильтры:</span>
                    </div>

                    <Select value={filters.roomType} onValueChange={(v) => updateFilter('roomType', v)}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Тип кабинета" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все типы</SelectItem>
                            <SelectItem value="lecture">Лекционная</SelectItem>
                            <SelectItem value="computer">Компьютерный класс</SelectItem>
                            <SelectItem value="practice">Кабинет для практики</SelectItem>
                        </SelectContent>
                    </Select>

                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={filters.hasProjector === true}
                            onCheckedChange={(c) => updateFilter('hasProjector', c ? true : null)}
                        />
                        Есть проектор
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                            checked={filters.showOnlyFree}
                            onCheckedChange={(c) => updateFilter('showOnlyFree', !!c)}
                        />
                        Показать только свободные
                    </label>

                    <Button
                        variant="outline"
                        onClick={() =>
                            onFiltersChange({
                                search: '',
                                roomType: 'all',
                                date: getRelativeDate(0),
                                hasProjector: null,
                                showOnlyFree: false,
                            })
                        }
                    >
                        Сбросить
                    </Button>
                </div>

                {/* Переключатель даты */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Дата:</span>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" className="h-8"
                            onClick={() => updateFilter('date', getRelativeDate(-1))}>
                            <Icons.ChevronLeft className="h-4 w-4 mr-1" />
                            Вчера
                        </Button>
                        <Button variant={filters.date === getRelativeDate(0) ? "default" : "outline"}
                            size="sm" className="h-8"
                            onClick={() => updateFilter('date', getRelativeDate(0))}>
                            Сегодня
                        </Button>
                        <Button variant="outline" size="sm" className="h-8"
                            onClick={() => updateFilter('date', getRelativeDate(1))}>
                            Завтра
                            <Icons.ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                        {getDateLabel(filters.date)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
