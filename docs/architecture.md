# Arquitectura del Vertical Slice

## Principios

- Separación clara entre render, red y dominio.
- Tipos de red compartidos en `@rpg/shared`.
- Configuración centralizada y consistente en `@rpg/config`.
- Diseño orientado a evolución por features.

## Capas

### Cliente (`apps/client`)

- `scenes/`: composición de juego (Phaser scene)
- `net/`: conexión con Colyseus y envío de input
- `ui/`: HUD (estado jugador + inventario)
- `world/`: utilidades de mapa/tilemap

### Realtime (`apps/game-server`)

- `rooms/`: Room principal + schema de estado
- `systems/movement.ts`: movimiento autoritativo básico del jugador
- `systems/combat.ts`: daño, muerte y drops
- `systems/respawn.ts`: respawn temporizado de entidades
- `systems/ai.ts`: patrulla simple para criaturas salvajes
- `systems/inventory.ts`: inventario runtime por sesión
- `world/`: definición de entidades iniciales

### API (`apps/api`)

- módulos HTTP separados por dominio: `auth`, `users`, `characters`
- `db/prisma.ts`: acceso a persistencia

### Shared (`packages/shared`)

- contratos de red tipados para eventos cliente-servidor
- enums de dominio
- constantes de gameplay
