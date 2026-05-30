FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# Build frontend
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build backend
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

FROM backend-deps AS backend-build
COPY backend/ .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS production
WORKDIR /app

COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=backend-build /app/backend/prisma ./backend/prisma
COPY --from=backend-build /app/backend/package*.json ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
