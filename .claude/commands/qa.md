# /qa

Executa checklist de qualidade antes de commitar uma feature.

## Checklist Automático

### TypeScript
- [ ] `pnpm typecheck` sem erros
- [ ] Sem `any` explícito
- [ ] Tipos inferidos do Zod (`z.infer<typeof Schema>`), não tipos duplicados

### Formulários e Mutações
- [ ] Schema Zod em `shared/schemas/`, nunca inline
- [ ] `zodResolver` no `useForm` — sem validação manual
- [ ] Toda mutação usa `useMutation` com `onMutate` / `onError` / `onSettled`
- [ ] `onSettled` invalida a query relevante
- [ ] Server Action valida com `Schema.safeParse()` antes do banco
- [ ] Optimistic update faz rollback correto em caso de erro

### Arquitetura
- [ ] Lógica de negócio está no Container, não no Screen
- [ ] Server Actions usam `'use server'`
- [ ] Nenhum `fetch` direto em componente (usar hooks ou actions)
- [ ] Feature não importa de outra feature (só de `shared/`)

### Supabase
- [ ] RLS ativa na tabela afetada
- [ ] Guard de fase no início de cada Server Action
- [ ] `eq('phase', currentPhase)` em updates de fase (otimistic lock)
- [ ] Sem `service_role` key no client-side

### UI Pixel
- [ ] Sem `border-radius`
- [ ] Sem `transition` em botões
- [ ] Fontes: Press Start 2P ou VT323 (não Inter/Roboto)
- [ ] Cores via variáveis CSS (`var(--green)`, não `#4ade80`)
- [ ] Skeleton loader presente em telas com fetch

### Regras de Negócio
- [ ] Jogador não pode enviar resposta duas vezes
- [ ] Jogador não pode adivinhar a si mesmo
- [ ] Ranking sem itens duplicados
- [ ] Validação de tamanho máximo nos inputs

### Mobile
- [ ] Touch targets >= 44px
- [ ] Font-size >= 16px nos inputs (evitar zoom no iOS)
- [ ] Testado em viewport 375px

## Como usar

Rodar antes de cada PR ou ao terminar um sprint:

```bash
pnpm typecheck && pnpm lint
```

Depois revisar manualmente os itens de arquitetura, UI e regras de negócio.
