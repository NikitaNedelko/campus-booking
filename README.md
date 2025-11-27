## Структура проекта

```
campus-booking/
├─ README.md
├─ .env                       # общее креды для локалки 
├─ .gitignore
├─ docker-compose.yml
├─ Makefile
├─ shared/
│  ├─ openapi.yaml            # контракт из FastAPI
│  └─ client/                 # автосгенерённый TS-клиент из OpenAPI
│
├─ backend/
│  ├─ pyproject.toml          # Poetry (config ruff, coverage.html)
│  ├─ poetry.lock
│  ├─ .env.example
│  ├─ .env                    # креды бэка
│  ├─ .pre-commit-config.yaml
│  ├─ app/
│  │  ├─ __init__.py
│  │  ├─ main.py              # создание FastAPI, middleware, роуты
│  │  ├─ settings.py          # Pydantic Settings из .env
│  │  ├─ context.py           # redis, s3, occr (БУДУЮЩЕМ).
│  │  ├─ api/
│  │  │  ├─ __init__.py
│  │  │  ├─ deps.py           # выдача AsyncSession для работы с БД
│  │  │  └─ login/          
│  │  │     ├─ __init__.py
│  │  │     ├─ routes.py      # APIRouter-ы по доменам
│  │  │     └─ schemas.py     # Pydantic-модели запрос/ответ
│  │  ├─ db/
│  │  │  ├─ __init__.py
│  │  │  ├─ base.py           # DeclarativeBase для всех models
│  │  │  ├─ session.py        # async engine + sessionmaker
│  │  │  ├─ alembic/          # Alembic миграции
|  │  │  │  ├─ versions/
│  │  │  │  └─ env.py
│  │  │  ├─ models/           # SQLAlchemy модели
│  │  │  │  ├─ __init__.py
│  │  │  │  └─ booking.py
│  │  │  └─ crud/     # CRUD запросы к бд
│  │  │     ├─ __init__.py
│  │  │     └─ booking_repo.py
│  │  ├─ logging/             # логер + middleware
│  │  │  ├─ __init__.py
│  │  │  ├─ context.py        # для проблора request_id    
│  │  │  ├─ logger.py         # кастомный json логер JsonFormatter
│  │  │  └─ middleware.py
│  │  ├─ services/            # бизнес-логика (use-cases)
│  │  │  ├─ __init__.py
│  │  │  └─ search_service.py # парсинг Ж-310 / Ж-3 / Ж
│  │  └─ utils/
│  │     ├─ __init__.py
│  │     └─ parsing.py        # разбор кодов аудиторий
|  ├── scripts/
│  |  └─ export_openapi.py    # генерация openapi.yaml
│  └─ tests/
│     ├─ conftest.py
│     ├─ integration/
│     └─ unit/
│
└─ frontend/
	├─ README.md
	├─ index.html
	├─ vite.config.ts
	├─ .gitignore
	├─ package.json
	├─ package-lock.json
	├─ public/
	└─ src/
	   ├─ App.tsx
	   ├─ main.tsx
	   ├─ types.ts
	   ├─ index.css
	   ├─ Attributions.md
	   ├─ styles/
	   │  └─ globals.css            # легенда цветов
	   ├─ data/
	   │  └─ mockData.ts            # rooms, timeSlots, generateMockBookings()
	   ├─ components/
	   │  ├─ SearchAndFilters.tsx   # поле поиска + фильтры + чекбоксы
	   │  ├─ ScheduleTable.tsx      # сетка расписания (6 пар), легенда цветов
	   │  ├─ BookingModal.tsx       # окно содания бронии
	   │  ├─ BookingSystem.tsx
	   │  ├─ LoginPage.tsx          # страница login
	   │  ├─ RoomHighlight          # подсветка названия кабинетов 
	   │  └─ figma/                 # мелкие фигма-ассеты/картинки если нужны
	   ├─ components/ui/            # сгенерённые shadcn компоненты
	   └─ guidelines/                    # file to provide the AI with rules and guidelines you want it to follow
	      └─ Guidelines.md

```

