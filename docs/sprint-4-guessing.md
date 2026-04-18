# Sprint 4 — Adivinhação

**Objetivo:** cada jogador vê os rankings anônimos e tenta adivinhar de quem é cada um.
**Estimativa:** 2–3h
**Depende de:** Sprint 3 concluído

---

## Escopo

- Mostrar rankings um a um (embaralhados)
- Jogador escolhe de quem acha que é cada ranking
- Não pode chutar em si mesmo
- Progresso visual (step blocks)
- Avanço automático para `results` quando todos enviarem

---

## Tasks

### 1. Server Action — enviar palpites

```typescript
// src/features/guessing/actions/submitGuesses.ts
'use server'
// recebe: guessMap: Record<targetPlayerId, guessedPlayerId>
// validar: sala em 'guessing', guesser não enviou ainda
// validar: guesser !== target (não chutar em si mesmo)
// inserir N rows em guesses (uma por ranking adivinhado)
// checkAllResponded → tryAdvancePhase('guessing' → 'results')
```

### 2. Ordem embaralhada

Rankings devem aparecer em ordem aleatória, diferente para cada jogador.
Embaralhar client-side com seed baseado no `playerId` para consistência ao recarregar.

```typescript
function seededShuffle<T>(arr: T[], seed: string): T[] {
  // implementar shuffle deterministico com seed
}
```

### 3. Componentes

- `GuessingContainer.tsx`
  - Carregar todos os rankings (visíveis pois fase = guessing)
  - Gerenciar estado: current index, guesses feitos
  - Ao terminar todos → submitGuesses
- `GuessingScreen.tsx`
  - Barra de progresso (step blocks)
  - Card do ranking atual (tema + lista de itens)
  - Grid de botões dos jogadores (exceto o próprio)
  - Seleção com feedback imediato → avança para próximo
- Reusar `waiting-screen.tsx`

### 4. Card de ranking

```tsx
// Mostrar:
// - Tema (destaque)
// - Lista ordenada: 🥇 item1, 🥈 item2...
// - NÃO mostrar de quem é até depois do palpite
```

### 5. Botões de jogador

```tsx
// Grid com avatar emoji + nome
// Ao clicar: seleciona, avança para próximo ranking
// Disabled: o próprio jogador
// Estado "selected" com borda verde
```

---

## Critérios de Aceite

- [ ] Rankings aparecem em ordem aleatória (diferente da ordem de envio)
- [ ] Cada ranking mostra tema + itens, mas não o dono
- [ ] Todos os jogadores aparecem como opção exceto o próprio
- [ ] Clicar em um jogador avança para o próximo ranking imediatamente
- [ ] Barra de progresso mostra quantos restam
- [ ] Após o último palpite, vai para tela de espera
- [ ] Fase avança para `results` quando todos enviarem
- [ ] Recarregar a página mantém progresso (detectar guesses já enviados)
