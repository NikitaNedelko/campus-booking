import { Search, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Filters } from '../types';

interface SearchAndFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function SearchAndFilters({ filters, onFiltersChange }: SearchAndFiltersProps) {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Функции для работы с датами
  const getRelativeDate = (daysOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (dateString: string): boolean => {
    return dateString === getRelativeDate(0);
  };

  return (
    <Card className="p-6 mb-6">
      <div className="space-y-4">
        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Фильтры:</span>
          </div>

          {/* Тип кабинета */}
          <Select value={filters.roomType} onValueChange={(value) => updateFilter('roomType', value)}>
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

          {/* Наличие проектора */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="projector"
              checked={filters.hasProjector === true}
              onCheckedChange={(checked) => 
                updateFilter('hasProjector', checked ? true : null)
              }
            />
            <label htmlFor="projector" className="text-sm font-medium">
              Есть проектор
            </label>
          </div>

          {/* Показать только свободные */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showOnlyFree"
              checked={filters.showOnlyFree}
              onCheckedChange={(checked) => updateFilter('showOnlyFree', checked)}
            />
            <label htmlFor="showOnlyFree" className="text-sm font-medium">
              Показать только свободные
            </label>
          </div>

          {/* Сбросить фильтры */}
          <Button
            variant="outline"
            onClick={() => onFiltersChange({
              search: '',
              roomType: 'all',
              date: new Date().toISOString().split('T')[0],
              hasProjector: null,
              showOnlyFree: false,
            })}
          >
            Сбросить
          </Button>
        </div>

        {/* Переключатель даты */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium flex-shrink-0">Дата:</span>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent px-3 py-1">
                  {formatDate(filters.date)}
                  <Calendar className="h-3 w-3 ml-2" />
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarComponent
                  mode="single"
                  selected={new Date(filters.date)}
                  onSelect={(date) => {
                    if (date) {
                      updateFilter('date', date.toISOString().split('T')[0]);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('date', getRelativeDate(-1))}
              className="h-8 px-3 hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Пред. день
            </Button>
            <Button
              variant={isToday(filters.date) ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('date', getRelativeDate(0))}
              disabled={isToday(filters.date)}
              className="h-8 px-3"
            >
              Сегодня
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('date', getRelativeDate(1))}
              className="h-8 px-3 hover:bg-accent"
            >
              След. день
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}