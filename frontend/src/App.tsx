import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { BookingSystem } from './components/BookingSystem';

export default function App() {
  const [user, setUser] = useState<{ username: string; password: string } | null>(null);

  const handleLogin = (credentials: { username: string; password: string }) => {
    // В реальном приложении здесь была бы проверка на сервере
    // Для демонстрации принимаем любые учетные данные
    setUser(credentials);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Если пользователь не авторизован, показываем страницу логина
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Если авторизован, показываем систему бронирования
  return <BookingSystem user={user} onLogout={handleLogout} />;
}