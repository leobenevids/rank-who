# RankWho

Jogo social multiplayer de ranking e adivinhação. Inspirado no Gartic.

Jogadores sugerem temas → todos ranqueiam anonimamente seu top 5 → tentam descobrir de quem é cada ranking.

---

## Stack

- **Next.js 15** (App Router)
- **Supabase** (Postgres + Realtime)
- **Tailwind 4** + **shadcn/ui**
- **Framer Motion**
- **TypeScript** strict
- Deploy: **Vercel**

---

## Rodando localmente

```bash
pnpm install
cp .env.example .env.local
# preencher variáveis do Supabase
pnpm dev
```

---

## Estrutura

```
src/
├── app/          # Roteamento Next.js
├── features/     # Domínios: room, suggesting, picking, ranking, guessing, results
└── shared/       # Components, hooks, lib, types reutilizáveis
```

Ver `CLAUDE.md` para documentação completa de arquitetura e convenções.

---

## Sprints

| Sprint | Objetivo | Status |
|---|---|---|
| 0 | Setup do projeto | ⬜ |
| 1 | Sala e Lobby | ⬜ |
| 2 | Sugestão e Escolha de Tema | ⬜ |
| 3 | Ranking anônimo | ⬜ |
| 4 | Adivinhação | ⬜ |
| 5 | Resultados e Play Again | ⬜ |
| 6 | Hardening | ⬜ |

---

## Comandos

```bash
pnpm dev          # dev server
pnpm build        # build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm db:types     # gerar tipos do Supabase
```
# rank-who
