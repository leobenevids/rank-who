# Sprint 1 — Sala e Lobby

**Objetivo:** jogadores conseguem criar sala, entrar pelo código e ver o lobby em tempo real.
**Estimativa:** 3–4h
**Depende de:** Sprint 0 concluído

---

## Escopo

- Home page (criar / entrar)
- Criação de sala com código único de 4 chars
- Entrada na sala por código
- Lobby com lista de jogadores em tempo real (Supabase Realtime)
- Host pode iniciar → avança para fase `suggesting`

---

## Tasks

### 1. Schemas Zod

```typescript
// src/shared/schemas/room.schema.ts
// JoinRoomSchema: { name, code }
// CreateRoomSchema: { name }
// Ver skill forms-and-mutations.md
```

### 2. Tipos base

```typescript
// src/shared/types/game.ts
export type Phase = 'lobby' | 'suggesting' | 'picking' | 'ranking' | 'guessing' | 'results'

export interface Room { id, code, phase, theme, top_n, host_id, expires_at }
export interface Player { id, room_id, name, avatar, is_host, is_afk }
```

### 2. Server Action — criar sala

```typescript
// src/features/room/actions/createRoom.ts
'use server'
// gerar código único (4 chars, retry se colisão)
// inserir room + player (host)
// retornar { code }
```

### 3. Server Action — entrar na sala

```typescript
// src/features/room/actions/joinRoom.ts
'use server'
// buscar sala pelo código
// validar: existe, está em 'lobby', nome não duplicado, < 10 jogadores
// inserir player
// retornar { roomId, playerId }
```

### 5. Hook Realtime com TanStack Query

```typescript
// src/shared/hooks/useRealtimeRoom.ts
// useQuery(['room', code], fetchRoom)
// + canal Realtime que invalida a query ao detectar mudanças
// Ver skill forms-and-mutations.md para implementação completa
```

### 5. Persistência de sessão do jogador

```typescript
// src/shared/hooks/usePlayer.ts
// salvar playerId e playerName no localStorage
// retornar { playerId, playerName, setPlayer, clearPlayer }
```

### 6. Componentes

**Home:**
- `HomeScreen.tsx` — tabs criar/entrar, inputs nome + código
- `HomeContainer.tsx` — chama Server Actions, redireciona para `/room/[code]`

**Lobby:**
- `LobbyScreen.tsx` — lista de jogadores, código da sala, botão iniciar (host only)
- `LobbyContainer.tsx` — usa `useRealtimeRoom`, passa para Screen
- `PlayerList.tsx` — lista com avatar emoji, badge HOST/YOU, corações HP
- `RoomCodeChip.tsx` — exibe código com copy on click

### 7. Rota `/room/[code]`

```typescript
// src/app/(game)/room/[code]/page.tsx
// buscar sala SSR (validar existe)
// renderizar RoomPage com fase atual
```

### 8. RLS básico

```sql
-- rooms: leitura pública por código
-- players: insert livre (auth anônima), select na própria sala
```

---

## Critérios de Aceite

- [ ] Criar sala gera código único de 4 chars
- [ ] Entrar em sala inexistente mostra erro pixel
- [ ] Entrar em sala que já começou mostra erro
- [ ] Nome duplicado na mesma sala mostra erro
- [ ] Jogadores aparecem em tempo real no lobby de todos
- [ ] Badge HOST aparece apenas para o primeiro jogador
- [ ] Botão "Iniciar" só aparece para o host
- [ ] Botão "Iniciar" desabilitado com menos de 2 jogadores
- [ ] Clicar no código copia para o clipboard
- [ ] Sala avança para `suggesting` ao iniciar
