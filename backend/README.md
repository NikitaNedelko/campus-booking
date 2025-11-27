# Campus Booking Backend

## Локальный запуск
1. Установите зависимости: `poetry install`.
2. Запустите сервер: `poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`.
3. Приложение будет доступно на `http://localhost:8000`.

## Пример запроса
```bash
curl -i http://localhost:8000/api/ping
```

## Пример ответа
```http
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

{"pong": true}
```
