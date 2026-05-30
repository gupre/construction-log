# 🏗️ Журнал работ

Внутренний инструмент для фиксации выполненных работ на строительном объекте. Прораб ведёт ежедневный учёт: что сделано, кем и в каком объёме.

## Стек

| Слой | Технология | Почему |
|------|-----------|--------|
| **Frontend** | React 18 + TypeScript + Vite | Требование ТЗ; Vite быстрее CRA |
| **Состояние** | TanStack Query v5 | Кеш, мутации, re-fetching из коробки |
| **Формы** | React Hook Form | Минимальный re-render, простая валидация |
| **Backend** | Node.js + Express + TypeScript | Быстрый старт, знакомая экосистема |
| **ORM** | Prisma | Type-safe SQL, удобные миграции |
| **БД** | PostgreSQL 16 | Надёжная реляционная БД |
| **Prod** | nginx | SPA fallback + reverse-proxy до бэкенда |
| **Контейнеры** | Docker + docker-compose | Один `docker compose up` — всё готово |

## Функциональность

**Обязательная:**
- Список записей: дата, вид работ, объём + единица, ФИО исполнителя, примечания
- Фильтрация по диапазону дат (от / до)
- Сортировка по дате (новые / старые)
- Добавление записи с валидацией всех полей
- Редактирование записи
- Удаление с подтверждением
- Данные хранятся в PostgreSQL через REST API

**Дополнительная:**
- Справочник видов работ — отдельная таблица в БД
- Выбор вида работ из выпадающего списка
- Единица измерения подставляется автоматически при выборе вида работ
- Страница управления справочником (добавить / удалить)
- Защита от удаления вида работ, используемого в записях

## Быстрый старт

### Требования
- Docker Desktop (https://www.docker.com/products/docker-desktop)

### Запуск
```bash
git clone https://github.com/YOUR_USERNAME/construction-log.git
cd construction-log
docker compose up --build
```

Открыть **http://localhost**

При первом запуске автоматически:
1. Поднимается PostgreSQL
2. Применяются миграции
3. Загружаются тестовые данные (18 видов работ + 5 примеров записей)

### Локальная разработка без Docker

Нужен PostgreSQL локально или `docker compose up db`.

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # прописать DATABASE_URL
npx prisma migrate deploy
npx tsx src/seed.ts
npm run dev            # порт 3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev            # порт 5173
```

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/entries` | Список записей (`dateFrom`, `dateTo`, `sortOrder`) |
| POST | `/api/entries` | Создать запись |
| PUT | `/api/entries/:id` | Обновить запись |
| DELETE | `/api/entries/:id` | Удалить запись |
| GET | `/api/work-types` | Список видов работ |
| POST | `/api/work-types` | Добавить вид работ |
| DELETE | `/api/work-types/:id` | Удалить вид работ |
| GET | `/api/health` | Health check |

## Структура проекта

```
construction-log/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── index.ts
│       ├── seed.ts
│       └── routes/
│           ├── entries.ts
│           └── workTypes.ts
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── types/
├── docker-compose.yml
└── README.md
```
