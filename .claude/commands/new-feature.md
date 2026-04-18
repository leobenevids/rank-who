# /new-feature

Cria o scaffold de uma nova feature seguindo a Tomato Architecture do RankWho.

## Uso
`/new-feature [nome]`

## O que criar

Para `nome = picking`, gerar:

```
src/features/picking/
├── components/
│   ├── PickingContainer.tsx   ← lógica, hooks, server actions
│   └── PickingScreen.tsx      ← UI pura, recebe props
├── hooks/                     ← hooks específicos da feature (se houver)
├── actions/
│   └── pickTheme.ts           ← 'use server'
└── lib/                       ← utils da feature (se houver)
```

## Template Container

```typescript
'use client'
import { useState } from 'react'
import { [Name]Screen } from './[Name]Screen'
import type { Room } from '@/shared/types/game'

interface [Name]ContainerProps {
  room: Room
  playerId: string
}

export function [Name]Container({ room, playerId }: [Name]ContainerProps) {
  // lógica aqui
  return <[Name]Screen />
}
```

## Template Screen

```typescript
interface [Name]ScreenProps {
  // props vindas do Container
}

export function [Name]Screen(props: [Name]ScreenProps) {
  return (
    <div className="screen">
      {/* UI pixel aqui — ver skill pixel-ui.md */}
    </div>
  )
}
```

## Template Server Action

```typescript
'use server'
import { createClient } from '@/shared/lib/supabase/server'

export async function [actionName](roomId: string, playerId: string, data: unknown) {
  const supabase = createClient()

  // 1. validar fase da sala
  // 2. validar jogador pertence à sala
  // 3. executar operação
  // 4. verificar avanço de fase
}
```
