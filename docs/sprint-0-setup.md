# Sprint 0 — Setup do Projeto

**Objetivo:** projeto rodando localmente com infra base configurada.
**Estimativa:** 2–3h

---

## Checklist

### 1. Criar projeto Next.js

```bash
pnpm create next-app@latest rankwho \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd rankwho
```

### 2. Instalar dependências

```bash
# UI
pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge
pnpm add framer-motion
pnpm dlx shadcn@latest init

# Supabase
pnpm add @supabase/supabase-js @supabase/ssr

# Formulários
pnpm add react-hook-form @hookform/resolvers zod

# Server state
pnpm add @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools

# Dev
pnpm add -D @types/node
```

### 3. Configurar Supabase

```bash
# Criar projeto em supabase.com
# Copiar URL e anon key para .env.local

NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Criar `/src/shared/lib/supabase/client.ts`, `server.ts`, `middleware.ts`
seguindo o padrão oficial do `@supabase/ssr`.

### 4. Criar tabelas no Supabase

Rodar o SQL do `CLAUDE.md` (seção Modelo de Dados) no SQL Editor do Supabase.

Habilitar **Realtime** nas tabelas: `rooms`, `players`, `suggestions`, `rankings`, `guesses`.

### 5. Gerar tipos TypeScript

```bash
pnpm add -D supabase
pnpm dlx supabase login
pnpm dlx supabase gen types typescript --project-id SEU_PROJECT_ID > src/shared/types/database.ts
```

Adicionar script no `package.json`:
```json
"db:types": "supabase gen types typescript --project-id SEU_PROJECT_ID > src/shared/types/database.ts"
```

### 6. Configurar Tailwind

Atualizar `globals.css` com as variáveis CSS da skill `pixel-ui.md`.
Importar fontes `Press Start 2P` e `VT323` do Google Fonts.

### 7. Estrutura de pastas

Criar a estrutura vazia conforme `tomato-arch.md`:

```bash
mkdir -p src/features/{room,suggesting,picking,ranking,guessing,results}/{components,hooks,actions,lib}
mkdir -p src/shared/{components/ui,hooks,lib/supabase,schemas,types}
```

### 8. Componentes pixel base

Criar em `src/shared/components/ui/`:
- `pixel-box.tsx`
- `pixel-btn.tsx`
- `pixel-input.tsx`
- `progress-blocks.tsx`

Baseados na skill `pixel-ui.md`.

### 9. Middleware Supabase

Configurar `middleware.ts` na raiz para refresh de sessão.

### 10. TanStack Query — Providers

Criar `src/shared/lib/query-client.ts` e `src/app/providers.tsx`.
Envolver o layout raiz com `<Providers>`.

Ver skill `forms-and-mutations.md` para implementação.

### 11. Smoke test

- [ ] `pnpm dev` roda sem erros
- [ ] Página inicial renderiza
- [ ] Conexão com Supabase funciona (testar um select simples)
- [ ] Tipos do banco gerados corretamente

---

## Entregável

Projeto rodando em `localhost:3000` com home page em branco e Supabase conectado.
