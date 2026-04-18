# Skill: Game Phases — State Machine RankWho

## Fases

```typescript
export type Phase =
  | 'lobby'
  | 'suggesting'
  | 'picking'
  | 'ranking'
  | 'guessing'
  | 'results'
```

## Fluxo

```
lobby → suggesting → picking → ranking → guessing → results
                                                        ↓
                                                    lobby (nova rodada)
```

---

## Triggers de Avanço

| Fase atual | Condição de avanço | Quem executa |
|---|---|---|
| `lobby` | Host clica "Iniciar" + mín. 2 jogadores | Host |
| `suggesting` | Todos os jogadores ativos enviaram sugestão | Automático |
| `picking` | Host confirma o tema | Host |
| `ranking` | Todos os jogadores ativos enviaram ranking | Automático |
| `guessing` | Todos os jogadores ativos enviaram palpites | Automático |
| `results` | — (fase terminal) | — |

---

## Implementação da Transição

```typescript
// features/room/lib/advancePhase.ts
import { createClient } from '@/shared/lib/supabase/server'
import type { Phase } from '@/shared/types/game'

const TRANSITIONS: Record<Phase, Phase> = {
  lobby:      'suggesting',
  suggesting: 'picking',
  picking:    'ranking',
  ranking:    'guessing',
  guessing:   'results',
  results:    'lobby',
}

export async function tryAdvancePhase(roomId: string, currentPhase: Phase) {
  const supabase = createClient()
  const nextPhase = TRANSITIONS[currentPhase]
  if (!nextPhase) return

  const { error } = await supabase
    .from('rooms')
    .update({ phase: nextPhase })
    .eq('id', roomId)
    .eq('phase', currentPhase) // otimistic lock — só avança se ainda está na fase atual

  return { error }
}
```

---

## Verificação de "Todos Responderam"

```typescript
// Usado em suggesting, ranking e guessing
export async function checkAllResponded(
  roomId: string,
  table: 'suggestions' | 'rankings' | 'guesses',
  currentPhase: Phase
) {
  const supabase = createClient()

  const [{ count: playerCount }, { count: responseCount }] = await Promise.all([
    supabase.from('players').select('*', { count: 'exact', head: true })
      .eq('room_id', roomId).eq('is_afk', false),
    supabase.from(table).select('*', { count: 'exact', head: true })
      .eq('room_id', roomId)
  ])

  if (playerCount && responseCount && responseCount >= playerCount) {
    await tryAdvancePhase(roomId, currentPhase)
  }
}
```

---

## AFK — Jogador Inativo

- Jogador sem resposta por **3 minutos** → `is_afk = true`
- Não bloqueia o avanço de fase
- Host pode marcar jogador como AFK manualmente
- AFK reseta ao entrar em nova rodada

```typescript
// Chamar após inserir cada resposta
await checkAllResponded(roomId, 'rankings', 'ranking')
```

---

## Hook de Fase no Cliente

```typescript
// shared/hooks/useGamePhase.ts
export function useGamePhase(room: Room | null) {
  const phase = room?.phase as Phase | undefined

  return {
    isLobby:      phase === 'lobby',
    isSuggesting: phase === 'suggesting',
    isPicking:    phase === 'picking',
    isRanking:    phase === 'ranking',
    isGuessing:   phase === 'guessing',
    isResults:    phase === 'results',
    phase,
  }
}
```

---

## Tela por Fase

```typescript
// app/(game)/room/[code]/page.tsx
const PHASE_SCREENS: Record<Phase, React.ComponentType<ScreenProps>> = {
  lobby:      LobbyContainer,
  suggesting: SuggestingContainer,
  picking:    PickingContainer,
  ranking:    RankingContainer,
  guessing:   GuessingContainer,
  results:    ResultsContainer,
}

export default function RoomPage() {
  const { room } = useRealtimeRoom(code)
  const Screen = room ? PHASE_SCREENS[room.phase] : null
  return Screen ? <Screen room={room} /> : <RoomSkeleton />
}
```
