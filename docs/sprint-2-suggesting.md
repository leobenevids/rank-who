# Sprint 2 — Sugestão e Escolha de Tema

**Objetivo:** fase de sugestão de temas pelos jogadores + host escolhe o tema da rodada.
**Estimativa:** 2–3h
**Depende de:** Sprint 1 concluído

---

## Escopo

- Fase `suggesting`: cada jogador sugere 1 tema
- Avanço automático para `picking` quando todos enviarem
- Fase `picking`: host escolhe entre sugestões + 3 aleatórios
- Avanço para `ranking` ao confirmar tema

---

## Tasks

### 1. Server Action — enviar sugestão

```typescript
// src/features/suggesting/actions/submitSuggestion.ts
'use server'
// validar: sala em 'suggesting', jogador não enviou ainda
// inserir em suggestions
// chamar checkAllResponded('suggestions', roomId, playerCount)
// se todos responderam → tryAdvancePhase(roomId, 'suggesting')
```

### 2. Server Action — escolher tema

```typescript
// src/features/picking/actions/pickTheme.ts
'use server'
// validar: sala em 'picking', caller é host
// update rooms SET theme = ?, phase = 'ranking'
```

### 3. Temas aleatórios pré-definidos

```typescript
// src/features/picking/lib/presetThemes.ts
// array de 16 temas
// função pickRandomPresets(n = 3): string[]
// presets são sorteados ao entrar em 'suggesting' e salvos em rooms.preset_themes (jsonb)
```

### 4. Componentes — Suggesting

- `SuggestingContainer.tsx` — estado local, chama submitSuggestion
- `SuggestingScreen.tsx` — input de tema, exemplos de inspiração
- `waiting-screen.tsx` (shared) — tela de espera com `ProgressBlocks` e sprite bounce

### 5. Componentes — Picking

- `PickingContainer.tsx` — host only, lista de opções, sortear
- `PickingScreen.tsx` — seções "Da galera" + "Aleatórios", seleção, confirmar
- `WaitingForHostScreen.tsx` — tela para não-host aguardar

### 6. Adicionar coluna preset_themes

```sql
alter table rooms add column preset_themes text[] default '{}';
```

---

## Critérios de Aceite

- [ ] Cada jogador vê a tela de sugestão com campo de texto
- [ ] Após enviar, vê tela de espera com progresso
- [ ] Quando todos enviarem, host vê tela de escolha automaticamente
- [ ] Sugestões da galera mostram o nome de quem sugeriu
- [ ] 3 temas aleatórios aparecem na seção "Aleatórios"
- [ ] Botão "Sortear" seleciona aleatoriamente entre todas as opções
- [ ] Não-host vê tela de espera "Host escolhendo..."
- [ ] Confirmar tema avança para fase `ranking`
- [ ] Tema escolhido fica salvo em `rooms.theme`
