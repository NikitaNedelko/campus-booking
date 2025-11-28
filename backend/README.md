# Campus Booking Backend

## Локальный запуск
1. Установите зависимости: `poetry install`.
2. Запустите сервер: `poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`.
3. Приложение будет доступно на `http://localhost:8000`.

## Пример запроса
```bash
curl -i http://localhost:8000/api/ping
```

Проверка готовности с обращением к базе:
```bash
curl -i http://localhost:8000/api/readyz
```

## Пример ответа
```http
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{"pong": true}
```

## Запуск через Docker
1. Создайте файл окружения: `cp .env.example .env` и задайте значения (минимум `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`).
2. Соберите образы: `docker compose build`.
3. Поднимите стек: `docker compose up -d`.  
   - Контейнер `migrate` автоматически применит миграции Alembic к базе `postgres`.  
   - Приложение будет доступно на `http://localhost:${APP_PORT:-8000}`.
4. Остановить и удалить ресурсы: `docker compose down -v` (флаг `-v` удалит volume с данными Postgres).

### Управление миграциями вручную
- Создать ревизию: `docker compose run --rm migrate alembic -c app/db/alembic.ini revision -m "message"`.
- Применить изменения: `docker compose run --rm migrate alembic -c app/db/alembic.ini upgrade head`.
- Откатить один шаг: `docker compose run --rm migrate alembic -c app/db/alembic.ini downgrade -1`.

### Обновление образа backend без пересборки всего стека
Если изменилась только логика приложения:
1. Пересоберите образ сервиса `app`: `docker compose build app`.
2. Перезапустите контейнер с новым образом: `docker compose up -d app`.
   - Миграции при таком сценарии не трогаются; если менялась схема БД — выполните `docker compose run --rm migrate alembic -c app/db/alembic.ini upgrade head` перед рестартом приложения.

### Как подключиться к Postgres внутри Docker
- Открыть интерактивный psql в контейнере:  
  `docker compose exec postgres psql -U ${DATABASE_USERNAME} -d ${DATABASE_NAME}`
- Выполнить SQL из файла:  
  `docker compose exec -T postgres psql -U ${DATABASE_USERNAME} -d ${DATABASE_NAME} -f /path/in/container.sql`  
  (подайте файл через stdin: `cat dump.sql | docker compose exec -T postgres psql -U ${DATABASE_USERNAME} -d ${DATABASE_NAME}`)
- Посмотреть список БД: `\l`, таблиц: `\dt`, выйти: `\q`.

## Alembic (локально без Docker)
- Перед командами убедитесь, что Postgres доступен и заданы переменные окружения из `.env` (`DATABASE_*`, `APP_PATH_PREFIX` и т.д.), иначе Alembic не получит DSN из `app/settings.py`.
- Применить все миграции: `poetry run alembic -c app/db/alembic.ini upgrade head`.
- Создать ревизию по изменениям моделей: `poetry run alembic -c app/db/alembic.ini revision --autogenerate -m "short message"`.
- Проверить автогенерацию перед коммитом: откройте файл из `app/db/alembic/versions` и убедитесь, что операции соответствуют ожидаемым (особенно для ENUM и INDEX параметров `postgresql_where`/`include`).
- Откатить на предыдущую версию: `poetry run alembic -c app/db/alembic.ini downgrade -1`.
- Автогенерация видит модели, потому что все классы импортированы в `app/db/models/__init__.py`; при добавлении новых моделей убедитесь, что импорт добавлен туда же.
