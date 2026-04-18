# RankWho — CLAUDE.md

## Visão Geral

**RankWho** é um jogo social multiplayer de ranking e adivinhação, inspirado no Gartic.
Jogadores sugerem temas, ranqueiam anonimamente seu top 5 e tentam descobrir quem fez cada ranking.

**Repositório:** `rankwho`
**Stack:** Next.js 16.2 · Supabase · Tailwind 4 · shadcn/ui · TypeScript
**Arquitetura:** Tomato Architecture (feature-based) · Container/Presenter
**Deploy:** Vercel

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Linguagem | TypeScript strict |
| Banco / Realtime | Supabase (Postgres + Realtime Channels) |
| Auth | Supabase Auth (anônimo) |
| Formulários | React Hook Form + Zod |
| Server state / cache | TanStack Query v5 |
| Estilo | Tailwind 4 + shadcn/ui |
| Animações | Framer Motion |
| Deploy | Vercel |
| Package manager | pnpm |

### Quando usar cada ferramenta

**React Hook Form + Zod**
Todos os formulários de input do jogo: sugestão de tema, ranking, entrada na sala.
Schema Zod definido uma vez em `shared/schemas/` e reutilizado no client (RHF) e no Server Action (`.parse()`).

**TanStack Query**
- Busca inicial da sala (`useQuery`) com cache e refetch automático
- Mutações com **optimistic updates**: ao enviar ranking/palpite, atualizar a UI antes da resposta do servidor e reverter em caso de erro
- Invalidação de queries após mudança de fase via Supabase Realtime

**Supabase Realtime**
Estado compartilhado entre jogadores em tempo real (substitui polling).
Complementa o TanStack Query — o canal realtime invalida queries quando o estado da sala muda.

---

## Arquitetura — Tomato Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── (game)/
│   │   ├── page.tsx            # Home (criar/entrar sala)
│   │   └── room/[code]/
│   │       └── page.tsx        # Sala de jogo
│   ├── api/
│   │   └── rooms/route.ts      # Criação de sala
│   └── layout.tsx
├── features/
│   ├── room/                   # Criação, entrada, lobby
│   ├── suggesting/             # Fase de sugestão de temas
│   ├── picking/                # Fase de escolha do tema (host)
│   ├── ranking/                # Fase de preenchimento do ranking
│   ├── guessing/               # Fase de adivinhação
│   └── results/                # Placar e revelações
├── shared/
│   ├── components/ui/          # shadcn/ui + componentes pixel
│   ├── hooks/                  # useRoom, useRealtimeRoom, usePlayer
│   ├── lib/
│   │   ├── supabase/           # client, server, middleware
│   │   ├── query-client.ts     # TanStack Query client singleton
│   │   └── utils.ts
│   ├── schemas/                # Zod schemas compartilhados client/server
│   │   ├── room.schema.ts
│   │   ├── ranking.schema.ts
│   │   └── guess.schema.ts
│   └── types/
│       └── game.ts             # tipos Room, Player, Phase, etc.
└── styles/
    └── globals.css
```

---

## Convenções de Código

- **Server Components por padrão** — usar `'use client'` apenas onde necessário
- **Arquivos `.ts` e `.tsx` em kebab-case** � ex.: `pixel-box.tsx`, `query-client.ts`
- **Container/Presenter** — lógica em `*Container.tsx`, UI em `*Screen.tsx`
- **Tipagem estrita** — sem `any`; usar tipos inferidos do Zod (`z.infer<typeof Schema>`)
- **Zod schemas em `shared/schemas/`** — reutilizados no RHF (client) e Server Actions (server)
- **TanStack Query para toda mutação** — optimistic updates padrão, nunca mutação direta sem feedback
- **Supabase Realtime invalida queries** — `queryClient.invalidateQueries` dentro do listener
- **Tailwind theme-based** — sem valores hardcoded de cor ou espaçamento
- **shadcn/ui primeiro** — criar componente custom só se shadcn não atender
- **Skeleton loaders** em todas as telas com fetch
- **Mobile-first** — tabelas viram cards em `< md`

---

## Modelo de Dados (Supabase)

```sql
rooms (
  id          uuid primary key,
  code        text unique not null,       -- 4 chars, ex: "AB12"
  phase       text not null,              -- lobby | suggesting | picking | ranking | guessing | results
  theme       text,
  top_n       int default 5,
  host_id     uuid references players(id),
  created_at  timestamptz default now(),
  expires_at  timestamptz                 -- now() + 2h
)

players (
  id          uuid primary key,
  room_id     uuid references rooms(id),
  name        text not null,
  avatar      text,
  is_host     bool default false,
  joined_at   timestamptz default now()
)

suggestions (
  id          uuid primary key,
  room_id     uuid references rooms(id),
  player_id   uuid references players(id),
  theme       text not null
)

rankings (
  id          uuid primary key,
  room_id     uuid references rooms(id),
  player_id   uuid references players(id),
  items       text[]                      -- ["item1", "item2", ...]
)

guesses (
  id          uuid primary key,
  room_id     uuid references rooms(id),
  guesser_id  uuid references players(id),
  target_id   uuid references players(id),  -- dono do ranking
  guessed_id  uuid references players(id)   -- palpite de quem é
)
```

---

## Fases do Jogo (Phase Machine)

```
LOBBY → SUGGESTING → PICKING → RANKING → GUESSING → RESULTS
                                                        ↓
                                                    (LOBBY nova rodada)
```

| Fase | Trigger de avanço |
|---|---|
| LOBBY → SUGGESTING | Host clica "Iniciar" (mín. 2 jogadores) |
| SUGGESTING → PICKING | Todos os jogadores enviaram sugestão |
| PICKING → RANKING | Host confirma o tema |
| RANKING → GUESSING | Todos enviaram ranking |
| GUESSING → RESULTS | Todos enviaram palpites |

---

## Regras de Negócio

1. Sala expira após **2 horas** de inatividade
2. Jogador inativo por **3 minutos** numa fase é marcado como `afk` e não bloqueia o avanço
3. Ranking não pode ter **itens duplicados**
4. Na adivinhação, **não é possível chutar em si mesmo**
5. Pontuação: **10 pts por acerto**, bônus de velocidade em sprints futuros
6. Host pode **pular jogador afk** manualmente
7. Mínimo **2 jogadores** para iniciar
8. Máximo **10 jogadores** por sala

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Comandos

```bash
pnpm dev          # servidor local
pnpm build        # build de produção
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm db:types     # gerar tipos do supabase
```

---

## Skills Disponíveis

- `.claude/skills/supabase-realtime.md` — padrões de canal realtime e RLS
- `.claude/skills/pixel-ui.md` — sistema de design 8-bit (Press Start 2P, pixel boxes)
- `.claude/skills/game-phases.md` — lógica de transição de fases e state machine
- `.claude/skills/tomato-arch.md` — convenções de estrutura de pastas
- `.claude/skills/forms-and-mutations.md` — padrões RHF + Zod + TanStack Query + optimistic updates

---

## Subagentes

- `qa` — roda checklist de qualidade antes de commits importantes

---

## Contexto Importante

- O jogo foi prototipado como React artifact com `window.storage` — a lógica de fases e UI já está validada
- Supabase Realtime substitui o polling de 1.5s do protótipo
- A estética é **8-bit pixel art** (ver skill `pixel-ui.md`)
- Público-alvo: grupos de amigos, uso casual via link compartilhado
