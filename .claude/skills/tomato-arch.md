# Skill: Tomato Architecture — RankWho

## Princípio

Código organizado por **feature/domínio**, não por tipo de arquivo.
Cada feature é autossuficiente: tem seus próprios components, hooks, actions e types.

---

## Estrutura de Pastas

```
src/
├── app/                          # Next.js App Router — só roteamento e layouts
│   ├── (game)/
│   │   ├── page.tsx              # Home — criar/entrar sala
│   │   └── room/[code]/
│   │       ├── page.tsx          # Sala — renderiza fase atual
│   │       └── loading.tsx       # Skeleton da sala
│   ├── api/
│   │   ├── rooms/route.ts        # POST /api/rooms — criar sala
│   │   └── rooms/[code]/
│   │       └── phase/route.ts    # PATCH — avançar fase
│   ├── layout.tsx
│   └── globals.css
│
├── features/                     # Domínios do jogo
│   ├── room/
│   │   ├── components/
│   │   │   ├── LobbyContainer.tsx
│   │   │   ├── LobbyScreen.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   └── RoomCodeChip.tsx
│   │   ├── hooks/
│   │   │   └── useCreateRoom.ts
│   │   ├── actions/
│   │   │   └── createRoom.ts     # Server Action
│   │   └── lib/
│   │       └── generateCode.ts
│   │
│   ├── suggesting/
│   │   ├── components/
│   │   │   ├── SuggestingContainer.tsx
│   │   │   └── SuggestingScreen.tsx
│   │   └── actions/
│   │       └── submitSuggestion.ts
│   │
│   ├── picking/
│   ├── ranking/
│   ├── guessing/
│   └── results/
│
└── shared/                       # Código compartilhado entre features
    ├── components/
    │   └── ui/                   # shadcn/ui + pixel components
    │       ├── PixelBox.tsx
    │       ├── PixelBtn.tsx
    │       ├── PixelInput.tsx
    │       └── ProgressBlocks.tsx
    ├── hooks/
    │   ├── useRealtimeRoom.ts
    │   ├── usePlayer.ts
    │   └── useGamePhase.ts
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts
    │   │   ├── server.ts
    │   │   └── middleware.ts
    │   └── utils.ts
    └── types/
        └── game.ts
```

---

## Regras

### 1. `app/` é só roteamento
Nenhuma lógica de negócio em `page.tsx`. Apenas importa o Container da feature correta.

```typescript
// app/(game)/room/[code]/page.tsx — CORRETO
import { RoomPage } from '@/features/room/components/RoomPage'
export default function Page({ params }) {
  return <RoomPage code={params.code} />
}
```

### 2. Container/Presenter
- `*Container.tsx` — lógica, hooks, Server Actions, estado
- `*Screen.tsx` — UI pura, recebe props, sem hooks de negócio

```typescript
// LobbyContainer.tsx
export function LobbyContainer({ room }: { room: Room }) {
  const { startSuggesting, isPending } = useStartSuggesting(room.id)
  return <LobbyScreen room={room} onStart={startSuggesting} isStarting={isPending} />
}

// LobbyScreen.tsx
export function LobbyScreen({ room, onStart, isStarting }: LobbyScreenProps) {
  return ( /* UI apenas */ )
}
```

### 3. Server Actions por feature
Cada feature tem sua pasta `actions/` com Server Actions tipadas.

```typescript
// features/ranking/actions/submitRanking.ts
'use server'
export async function submitRanking(roomId: string, playerId: string, items: string[]) {
  // validação + insert + checkAllResponded
}
```

### 4. Shared só para reuso real
Só vai para `shared/` se for usado em 2+ features.
Componentes usados em apenas uma feature ficam dentro dela.

### 5. Tipos centralizados
```typescript
// shared/types/game.ts
export type Phase = 'lobby' | 'suggesting' | 'picking' | 'ranking' | 'guessing' | 'results'

export interface Room {
  id: string
  code: string
  phase: Phase
  theme: string | null
  top_n: number
  host_id: string
  players: Player[]
}

export interface Player {
  id: string
  name: string
  avatar: string
  is_host: boolean
  is_afk: boolean
}
```

---

## O que NÃO fazer

```
❌ /components/LobbyScreen.tsx        (sem feature)
❌ /hooks/useRoom.ts                  (na raiz)
❌ /pages/room.tsx                    (Pages Router)
❌ lógica de negócio em page.tsx
❌ fetch direto em Screen (Presenter)
❌ import de feature A dentro de feature B (usar shared/)
```
