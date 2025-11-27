import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Room, TimeSlot, Booking } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  timeSlot: TimeSlot | null;
  booking: Booking | null;
  onSave: (bookingData: Partial<Booking>) => void;
  onDelete?: () => void;
  selectedDate: string;
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  room, 
  timeSlot, 
  booking, 
  onSave, 
  onDelete,
  selectedDate
}: BookingModalProps) {
  const [subject, setSubject] = useState(booking?.subject || '');
  const [teacher, setTeacher] = useState(booking?.teacher || '');
  const [notes, setNotes] = useState('');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [repeatEndDate, setRepeatEndDate] = useState<Date>();
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('15');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const isEditing = !!booking?.isMyBooking;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCorpusInfo = (room: Room): string => {
    return `Корпус ${room.building}, ${room.floor} этаж`;
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!subject.trim()) {
      newErrors.subject = 'Обязательное поле';
    }

    if (repeatWeekly && !repeatEndDate) {
      newErrors.repeatEndDate = 'Выберите дату окончания повтора';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm() || !room || !timeSlot) return;

    onSave({
      roomId: room.id,
      timeSlotId: timeSlot.id,
      subject,
      teacher: teacher || 'Вы',
      isMyBooking: true,
      status: 'my-booking',
    });

    // Сброс формы
    setSubject('');
    setTeacher('');
    setNotes('');
    setRepeatWeekly(false);
    setRepeatEndDate(undefined);
    setReminder(false);
    setReminderTime('15');
    setErrors({});
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!room || !timeSlot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Редактировать бронь' : 'Создать бронь'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Readonly информация о бронировании */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Кабинет</Label>
              <Input
                value={room.name}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Корпус / Этаж</Label>
              <Input
                value={getCorpusInfo(room)}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Дата</Label>
              <Input
                value={formatDate(selectedDate)}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Пара</Label>
              <Input
                value={`${timeSlot.pairNumber} пара, ${timeSlot.startTime}–${timeSlot.endTime}`}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          {/* Преподаватель */}
          <div>
            <Label htmlFor="teacher">Преподаватель</Label>
            <Input
              id="teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Козлов К.К."
              className={booking?.teacher ? "bg-muted" : ""}
              readOnly={!!booking?.teacher}
            />
          </div>

          {/* Название предмета */}
          <div>
            <Label htmlFor="subject">Название предмета *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) {
                  setErrors({...errors, subject: ''});
                }
              }}
              placeholder="Например, Системный анализ"
              className={errors.subject ? "border-destructive" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-destructive mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Примечания */}
          <div>
            <Label htmlFor="notes">Примечания</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Необязательное поле"
              rows={3}
            />
          </div>

          {/* Повтор */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="repeat"
                checked={repeatWeekly}
                onCheckedChange={(checked) => {
                  setRepeatWeekly(!!checked);
                  if (!checked) {
                    setRepeatEndDate(undefined);
                    if (errors.repeatEndDate) {
                      setErrors({...errors, repeatEndDate: ''});
                    }
                  }
                }}
              />
              <label htmlFor="repeat" className="text-sm font-medium">
                Повторять каждую неделю до…
              </label>
              {repeatWeekly && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`ml-2 ${errors.repeatEndDate ? 'border-destructive' : ''}`}
                    >
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {repeatEndDate ? repeatEndDate.toLocaleDateString('ru-RU') : 'Выберите дату'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={repeatEndDate}
                      onSelect={(date) => {
                        setRepeatEndDate(date);
                        if (errors.repeatEndDate) {
                          setErrors({...errors, repeatEndDate: ''});
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
            {errors.repeatEndDate && (
              <p className="text-sm text-destructive">{errors.repeatEndDate}</p>
            )}
          </div>

          {/* Напоминание */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reminder"
                checked={reminder}
                onCheckedChange={(checked) => setReminder(!!checked)}
              />
              <label htmlFor="reminder" className="text-sm font-medium">
                Напомнить за…
              </label>
            </div>
            {reminder && (
              <RadioGroup
                value={reminderTime}
                onValueChange={setReminderTime}
                className="flex gap-4 ml-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15" id="r15" />
                  <Label htmlFor="r15" className="text-sm">15 минут</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="60" id="r60" />
                  <Label htmlFor="r60" className="text-sm">60 минут</Label>
                </div>
              </RadioGroup>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              Отменить бронь
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            {isEditing ? 'Закрыть' : 'Отмена'}
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Сохранить' : 'Забронировать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}