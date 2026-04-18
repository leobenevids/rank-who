# Sprint 3 — Ranking

**Objetivo:** jogadores preenchem anonimamente seu top 5 (ou top N).
**Estimativa:** 2h
**Depende de:** Sprint 2 concluído

---

## Escopo

- Exibir o tema escolhido
- Formulário de top N (padrão: 5)
- Validação: sem itens vazios, sem duplicados
- Envio anônimo — outros jogadores não veem o ranking até a fase de adivinhação
- Tela de espera com progresso após envio
- Avanço automático para `guessing` quando todos enviarem

---

## Tasks

### 1. Schema Zod

```typescript
// src/shared/schemas/ranking.schema.ts
// RankingSchema: items array com validação de duplicados
// Ver skill forms-and-mutations.md
```

### 2. Hook de mutação com optimistic update

```typescript
// features/ranking/hooks/useSubmitRanking.ts
// useMutation com onMutate / onError / onSettled
// Ver skill forms-and-mutations.md para implementação completa
```

### 3. Server Action com Zod

```typescript
// src/features/ranking/actions/submitRanking.ts
'use server'
// RankingSchema.safeParse({ items }) — validação server-side com mesmo schema
// guard de fase (sala em 'ranking')
// validar jogador não enviou ainda
// inserir em rankings { room_id, player_id, items }
// checkAllResponded → tryAdvancePhase('ranking' → 'guessing')
// Ver skill forms-and-mutations.md para exemplo completo
```

### 4. RLS — rankings ocultos até guessing

### 2. RLS — rankings ocultos até guessing

```sql
create policy "rankings hidden until guessing"
  on rankings for select
  using (
    auth.uid()::text = player_id::text
    or exists (
      select 1 from rooms
      where rooms.id = rankings.room_id
        and rooms.phase in ('guessing', 'results')
    )
  );
```

### 5. Componentes com RHF

- `RankingContainer.tsx` — `useForm` com `zodResolver(RankingSchema)`, chama `useSubmitRanking`
- `RankingScreen.tsx` — recebe `form: UseFormReturn<RankingInput>`, renderiza inputs com `register`, exibe erros inline
- Reusar `waiting-screen.tsx` do Sprint 2

### 6. Validação

Feita pelo Zod via `zodResolver` no RHF — sem validação manual.
Erros acessados via `form.formState.errors`.
Schema em `shared/schemas/ranking.schema.ts` — ver skill `forms-and-mutations.md`.

---

## Critérios de Aceite

- [ ] Tema exibido com destaque no topo
- [ ] N inputs (padrão 5) com número e medalha
- [ ] Botão desabilitado com campos vazios
- [ ] Erro inline para itens duplicados
- [ ] Após enviar, tela de espera com contagem de quem já enviou
- [ ] Rankings NÃO aparecem para outros jogadores durante essa fase
- [ ] Quando todos enviarem, fase avança para `guessing` automaticamente
- [ ] Jogador que recarregar a página não pode reenviar (detectar via query)
