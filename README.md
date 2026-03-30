# RPG Online 2D - Vertical Slice Base

Base técnica inicial para un RPG online 2D top-down en web, pensada para desarrollo iterativo por features.

## Stack

- Monorepo con **pnpm workspaces**
- TypeScript en todo el proyecto
- Cliente: **Vite + Phaser 3**
- Realtime server: **Node.js + Colyseus**
- API HTTP: **Fastify**
- Persistencia: **PostgreSQL + Prisma**

## Estructura

```
/apps/client
/apps/game-server
/apps/api
/packages/shared
/packages/config
/prisma
/docs
```

## Requisitos

- Node.js 20+
- pnpm 10+
- PostgreSQL 15+

## Instalación

```bash
pnpm install
cp .env.example .env
```

## Scripts raíz

```bash
pnpm dev          # levanta client + game-server + api en paralelo
pnpm build        # build de todos los paquetes/apps
pnpm typecheck    # chequeo de tipos en monorepo
pnpm db:generate  # prisma generate
pnpm db:migrate   # prisma migrate dev
pnpm db:seed      # seed inicial de datos
```

## Flujo mínimo end-to-end

1. Levantar PostgreSQL y configurar `DATABASE_URL`.
2. Ejecutar migraciones y seed.
3. Levantar `pnpm dev`.
4. Abrir cliente en `http://localhost:5173`.
5. El cliente conecta al room `main_room` en Colyseus, envía input y visualiza updates remotos.

## MVP incluido

- Mapa único con colisiones de borde.
- Movimiento local 8 direcciones + cámara follow.
- UI mínima (nombre + HP).
- Estado de jugadores sincronizado en tiempo real con nombres visibles.
- Entidades de mundo iniciales:
  - recurso interactivo (`resource_tree_1`) con respawn temporizado
  - criatura salvaje (`wild_slime_1`) con patrulla simple
- Ataque básico real-time con daño, muerte, drop visible y actualización de inventario local (`WOOD`, `ESSENCE`).
- API Fastify con healthcheck y módulos placeholder (`auth`, `users`, `characters`).
- Prisma con modelos `User`, `Character`, `Item`, `InventoryItem` y seed demo.

## Próximos pasos sugeridos

- Autoridad completa de movimiento en server + reconciliación cliente.
- Sistema de inventario persistente en tiempo real.
- Spawn/despawn por zonas y loop de IA de criaturas.
- Login real con tokens y sesión de personaje.
