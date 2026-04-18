# Skill: Supabase Realtime — RankWho

## Objetivo
Padrões para usar Supabase Realtime Channels no RankWho, substituindo o polling com `window.storage`.

---

## Canal por Sala

Cada sala tem um canal único. Todos os jogadores da sala se inscrevem nele.

```typescript
// shared/hooks/useRealtimeRoom.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/shared/lib/supabase/client'
import type { Room } from '@/shared/types/game'

export function useRealtimeRoom(code: string) {
  const [room, setRoom] = useState<Room | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!code) return

    // Fetch inicial
    supabase
      .from('rooms')
      .select('*, players(*), suggestions(*), rankings(*), guesses(*)')
      .eq('code', code)
      .single()
      .then(({ data }) => setRoom(data))

    // Inscrição realtime
    const channel = supabase
      .channel(`room:${code}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        filter: `code=eq.${code}`,
        table: 'rooms'
      }, ({ new: updated }) => {
        setRoom(prev => ({ ...prev, ...updated } as Room))
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'players',
      }, () => refetchRoom(code, supabase, setRoom))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [code])

  return { room }
}
```

---

## Padrão de Transição de Fase

Sempre buscar o estado atual antes de modificar (evitar race conditions):

```typescript
// CORRETO — busca, modifica, salva
async function advancePhase(roomId: string, nextPhase: Phase) {
  const supabase = createClient()

  const { data: room } = await supabase
    .from('rooms')
    .select('phase')
    .eq('id', roomId)
    .single()

  if (room?.phase !== expectedCurrentPhase) return // guard

  await supabase
    .from('rooms')
    .update({ phase: nextPhase })
    .eq('id', roomId)
}
```

---

## RLS (Row Level Security)

Políticas mínimas para o jogo funcionar:

```sql
-- Qualquer um pode ler sala pelo código
create policy "read room by code"
  on rooms for select
  using (true);

-- Só jogadores da sala podem inserir/atualizar
create policy "players can write own data"
  on players for insert
  with check (true); -- auth anônima libera

-- Rankings: jogador só vê o próprio até fase GUESSING
create policy "rankings hidden until guessing"
  on rankings for select
  using (
    auth.uid() = player_id
    or exists (
      select 1 from rooms
      where rooms.id = rankings.room_id
      and rooms.phase in ('guessing', 'results')
    )
  );
```

---

## Presença (Jogadores Online)

```typescript
const channel = supabase.channel(`room:${code}`, {
  config: { presence: { key: playerId } }
})

channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  setOnlinePlayers(Object.keys(state))
})

await channel.track({ player_id: playerId, name: playerName })
```

---

## Checklist de Uso

- [ ] Canal nomeado como `room:{code}` sempre
- [ ] Remover canal no `useEffect` cleanup
- [ ] Guards de fase antes de escrever no banco
- [ ] RLS ativa em todas as tabelas
- [ ] Tipos gerados com `pnpm db:types`
