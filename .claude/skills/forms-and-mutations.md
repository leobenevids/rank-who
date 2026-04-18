# Skill: Forms & Mutations — RankWho

Padrões para React Hook Form, Zod, TanStack Query e optimistic updates.

---

## Zod Schemas — definir uma vez, usar em todo lugar

Schemas ficam em `src/shared/schemas/`. São importados tanto no client (RHF) quanto no Server Action.

```typescript
// src/shared/schemas/ranking.schema.ts
import { z } from 'zod'

export const RankingSchema = z.object({
  items: z
    .array(z.string().trim().min(1, 'Campo obrigatório').max(50))
    .length(5)
    .refine(
      items => new Set(items.map(i => i.toLowerCase())).size === items.length,
      { message: 'Itens duplicados não são permitidos' }
    ),
})

export type RankingInput = z.infer<typeof RankingSchema>
```

```typescript
// src/shared/schemas/room.schema.ts
import { z } from 'zod'

export const JoinRoomSchema = z.object({
  name: z.string().trim().min(1).max(20),
  code: z.string().length(4).toUpperCase(),
})

export const CreateRoomSchema = z.object({
  name: z.string().trim().min(1).max(20),
})

export type JoinRoomInput = z.infer<typeof JoinRoomSchema>
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>
```

---

## React Hook Form + Zod — padrão de formulário

```typescript
// features/ranking/components/RankingContainer.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RankingSchema, type RankingInput } from '@/shared/schemas/ranking.schema'
import { useSubmitRanking } from '../hooks/useSubmitRanking'

export function RankingContainer({ room, playerId }: Props) {
  const { mutate: submitRanking, isPending } = useSubmitRanking(room.id, playerId)

  const form = useForm<RankingInput>({
    resolver: zodResolver(RankingSchema),
    defaultValues: { items: ['', '', '', '', ''] },
  })

  return (
    <RankingScreen
      form={form}
      onSubmit={form.handleSubmit(data => submitRanking(data))}
      isPending={isPending}
      theme={room.theme}
    />
  )
}
```

```typescript
// features/ranking/components/RankingScreen.tsx
import type { UseFormReturn } from 'react-hook-form'
import type { RankingInput } from '@/shared/schemas/ranking.schema'

interface RankingScreenProps {
  form: UseFormReturn<RankingInput>
  onSubmit: () => void
  isPending: boolean
  theme: string
}

export function RankingScreen({ form, onSubmit, isPending, theme }: RankingScreenProps) {
  const { register, formState: { errors, isValid } } = form

  return (
    <div className="screen">
      {/* tema */}
      {[0,1,2,3,4].map(i => (
        <div key={i} className="rank-input-row">
          <input
            {...register(`items.${i}`)}
            placeholder={`${i + 1}º lugar_`}
          />
          {errors.items?.[i] && (
            <span className="error">{errors.items[i]?.message}</span>
          )}
        </div>
      ))}
      {errors.items?.root && (
        <span className="error">{errors.items.root.message}</span>
      )}
      <PixelBtn onClick={onSubmit} disabled={!isValid || isPending}>
        {isPending ? '...' : '► ENVIAR RANKING'}
      </PixelBtn>
    </div>
  )
}
```

---

## TanStack Query — setup

```typescript
// src/shared/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000 },
      mutations: { retry: 1 },
    },
  })
}
```

```typescript
// src/app/providers.tsx
'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { makeQueryClient } from '@/shared/lib/query-client'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

---

## Optimistic Updates — padrão para mutações de jogo

Toda ação do jogador (enviar ranking, enviar palpite) usa optimistic update:
a UI atualiza imediatamente, e reverte se o servidor retornar erro.

```typescript
// features/ranking/hooks/useSubmitRanking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitRanking } from '../actions/submitRanking'
import type { RankingInput } from '@/shared/schemas/ranking.schema'
import type { Room } from '@/shared/types/game'

export function useSubmitRanking(roomId: string, playerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RankingInput) => submitRanking(roomId, playerId, data.items),

    onMutate: async (data) => {
      // Cancelar queries em flight
      await queryClient.cancelQueries({ queryKey: ['room', roomId] })

      // Snapshot do estado atual (para rollback)
      const previous = queryClient.getQueryData<Room>(['room', roomId])

      // Optimistic update — marcar jogador como "já enviou"
      queryClient.setQueryData<Room>(['room', roomId], old => {
        if (!old) return old
        return {
          ...old,
          rankings: {
            ...old.rankings,
            [playerId]: data.items, // UI reflete imediatamente
          },
        }
      })

      return { previous }
    },

    onError: (_err, _data, context) => {
      // Rollback em caso de erro
      if (context?.previous) {
        queryClient.setQueryData(['room', roomId], context.previous)
      }
    },

    onSettled: () => {
      // Refetch para sincronizar com servidor
      queryClient.invalidateQueries({ queryKey: ['room', roomId] })
    },
  })
}
```

---

## TanStack Query + Supabase Realtime — integração

O Realtime notifica mudanças de fase. Ao receber, invalida a query da sala.

```typescript
// shared/hooks/useRealtimeRoom.ts
'use client'
import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import { fetchRoom } from '@/shared/lib/fetchRoom'

export function useRealtimeRoom(code: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const query = useQuery({
    queryKey: ['room', code],
    queryFn: () => fetchRoom(code),
    staleTime: Infinity, // Realtime cuida da atualização
  })

  useEffect(() => {
    const channel = supabase
      .channel(`room:${code}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `code=eq.${code}` },
        () => queryClient.invalidateQueries({ queryKey: ['room', code] })
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'players' },
        () => queryClient.invalidateQueries({ queryKey: ['room', code] })
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [code, queryClient, supabase])

  return query
}
```

---

## Server Action com Zod

```typescript
// features/ranking/actions/submitRanking.ts
'use server'
import { createClient } from '@/shared/lib/supabase/server'
import { RankingSchema } from '@/shared/schemas/ranking.schema'

export async function submitRanking(roomId: string, playerId: string, items: string[]) {
  // Validação server-side com o mesmo schema do client
  const parsed = RankingSchema.safeParse({ items })
  if (!parsed.success) throw new Error(parsed.error.message)

  const supabase = createClient()

  // Guard de fase
  const { data: room } = await supabase
    .from('rooms').select('phase').eq('id', roomId).single()
  if (room?.phase !== 'ranking') throw new Error('Fase inválida')

  // Inserir
  const { error } = await supabase
    .from('rankings')
    .insert({ room_id: roomId, player_id: playerId, items: parsed.data.items })
  if (error) throw error

  // Verificar se todos enviaram
  await checkAllResponded(roomId, 'rankings', 'ranking')
}
```

---

## Checklist de Uso

- [ ] Schema Zod em `shared/schemas/`, nunca inline no componente
- [ ] `zodResolver` no `useForm` — nunca validação manual
- [ ] Toda mutação usa `useMutation` com `onMutate` / `onError` / `onSettled`
- [ ] `onSettled` sempre invalida a query relevante
- [ ] Server Action valida com `Schema.safeParse()` antes de tocar no banco
- [ ] Erro de validação retorna mensagem útil (não stack trace)
