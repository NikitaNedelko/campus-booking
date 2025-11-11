import React from 'react';

interface RoomHighlightProps {
  roomName: string;
  searchQuery: string;
}

export function RoomHighlight({ roomName, searchQuery }: RoomHighlightProps) {
  if (!searchQuery.trim()) {
    return <span>{roomName}</span>;
  }

  const query = searchQuery.trim().toUpperCase();
  const name = roomName.toUpperCase();
  
  // Проверяем точные совпадения для подсвечивания
  let shouldHighlight = false;
  
  // Полное название кабинета
  if (name === query) {
    shouldHighlight = true;
  }
  
  // Этаж корпуса (например, Ж-3 для Ж-310)
  const floorMatch = query.match(/^([А-Я])-(\d)$/);
  if (floorMatch) {
    const [, building, floor] = floorMatch;
    const nameMatch = name.match(/^([А-Я])-(\d)/);
    if (nameMatch && nameMatch[1] === building && nameMatch[2] === floor) {
      shouldHighlight = true;
    }
  }
  
  // Только корпус
  const buildingMatch = query.match(/^([А-Я])$/);
  if (buildingMatch) {
    const building = buildingMatch[1];
    if (name.startsWith(building + '-')) {
      shouldHighlight = true;
    }
  }
  
  // Обычный поиск по подстроке
  if (name.includes(query)) {
    shouldHighlight = true;
  }

  return (
    <span className={shouldHighlight ? 'bg-yellow-200 px-1 rounded' : ''}>
      {roomName}
    </span>
  );
}