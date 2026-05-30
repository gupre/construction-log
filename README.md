# 🏗️ Журнал работ — Construction Work Log

Внутренний инструмент для фиксации выполненных работ на строительном объекте. Прораб ведёт ежедневный учёт: что сделано, кем и в каком объёме.

---

## Стек и обоснование

| Слой | Технология | Почему |
|------|-----------|--------|
| **Frontend** | React 18 + TypeScript | Требование ТЗ |
| **Сборка** | Vite | Быстрый HMR, нет boilerplate CRA |
| **Состояние / запросы** | TanStack Query v5 | Server state management «из коробки»: кеш, re-fetching, мутации |
| **Формы** | React Hook Form | Минимальный re-render, простая валидация |
| **Backend** | Node.js + Express + TypeScript | Знакомый экосистема, быстрый старт |
| **ORM** | Prisma | Type-safe SQL, удобные миграции, читаемая схема |
| **БД** | PostgreSQL 16 | Надёжная реляционная БД; данные живут в именованном Docker volume |
| **Prod-сервер** | nginx | SPA fallback + reverse-proxy до бэкенда |
| **Контейнеры** | Docker + docker-compose | Один `docker-compose up` — всё готово |
| **Валидация API** | express-validator | Декларативная, поддерживает кастомные сообщения |

---

## Функциональность

### Обязательная (Minimum)
- ✅ Список записей: дата, вид работ, объём+единица, ФИО исполнителя
- ✅ Фильтрация по дате (от / до)
- ✅ Сортировка по дате (новые ↑ / старые ↓)
- ✅ Добавление записи с валидацией всех обязательных полей
- ✅ Данные сохраняются в PostgreSQL (не in-memory, не файл)
- ✅ Удаление записи (с подтверждением)
- ✅ Редактирование существующей записи

### Дополнительная (Optional)
- ✅ Справочник видов работ — отдельная таблица `work_types` в БД
- ✅ Выбор вида работ из выпадающего списка (не свободный ввод)
- ✅ Единица измерения подставляется автоматически при выборе вида работ
- ✅ Страница управления справочником (добавить / удалить вид работ)
- ✅ Защита от удаления вида работ, используемого в записях

---

## Запуск

### Требования
- Docker ≥ 24
- docker-compose (входит в Docker Desktop)

### Production-сборка (рекомендуется)

```bash
git clone <repo-url>
cd construction-log
docker-compose up --build
```

Приложение доступно на **http://localhost**  
API — на **http://localhost:3000/api**

При первом запуске автоматически:
1. Поднимается PostgreSQL
2. Применяются миграции Prisma
3. Заполняются тестовые данные (seed: 18 видов работ + 5 примеров записей)

### Локальная разработка (без Docker)

Потребуется PostgreSQL, запущенный локально или через `docker-compose up db`.

**Backend:**
```bash
cd backend
npm install
cp .env.example .env          # настройте DATABASE_URL
npx prisma migrate deploy
npx tsx src/seed.ts           # опционально
npm run dev                   # порт 3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev                   # порт 5173, proxy → localhost:3000
```

---

## Структура проекта

```
construction-log/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # схема БД
│   │   └── migrations/          # SQL-миграции
│   └── src/
│       ├── index.ts             # Express app
│       ├── seed.ts              # начальные данные
│       └── routes/
│           ├── entries.ts       # CRUD журнальных записей
│           └── workTypes.ts     # CRUD видов работ
├── frontend/
│   └── src/
│       ├── api/                 # axios-клиент
│       ├── components/
│       │   ├── ui.tsx           # базовые UI-компоненты
│       │   └── EntryForm.tsx    # форма добавления/редактирования
│       ├── pages/
│       │   ├── JournalPage.tsx  # основная страница журнала
│       │   └── WorkTypesPage.tsx# страница справочника
│       └── types/               # TypeScript-типы
├── docker-compose.yml
└── README.md
```

---

## API

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/entries` | Список записей (параметры: `dateFrom`, `dateTo`, `sortOrder`) |
| `POST` | `/api/entries` | Создать запись |
| `PUT` | `/api/entries/:id` | Обновить запись |
| `DELETE` | `/api/entries/:id` | Удалить запись |
| `GET` | `/api/work-types` | Список видов работ |
| `POST` | `/api/work-types` | Добавить вид работ |
| `DELETE` | `/api/work-types/:id` | Удалить вид работ |
| `GET` | `/api/health` | Health check |
