# Sprint 5 — Resultados e Play Again

**Objetivo:** placar final, revelações e opção de jogar novamente.
**Estimativa:** 2h
**Depende de:** Sprint 4 concluído

---

## Escopo

- Placar com pontuação (10pts por acerto)
- Revelação: mostrar cada ranking com dono revelado + quem acertou/errou
- Host pode reiniciar (volta para lobby, preserva jogadores)

---

## Tasks

### 1. Calcular pontuação

```typescript
// src/features/results/lib/calcScores.ts
// Para cada guess correto (guessed_id === target_id), guesser ganha 10pts
// Agrupar por guesser
// Retornar: Record<playerId, { name, score, avatar }>
// Ordenar por score desc
```

### 2. Server Action — play again

```typescript
// src/features/results/actions/playAgain.ts
'use server'
// validar: caller é host, sala em 'results'
// deletar suggestions, rankings, guesses da sala
// update rooms: phase='lobby', theme=null, preset_themes={}
// jogadores permanecem na sala
```

### 3. Componentes

- `ResultsContainer.tsx` — buscar dados, calcular scores, pass para Screen
- `ResultsScreen.tsx`
  - Seção "High Score" — podium/placar com destaque amarelo
  - Seção "Revelações" — um card por jogador
    - Avatar + nome do dono
    - Lista dos itens ranqueados
    - Tags de quem acertou (verde ✓) e errou (vermelho ✗) com o palpite
  - Botão "Play Again?" só para o host

### 4. Card de revelação

```tsx
<RevealCard>
  <OwnerHeader avatar={getAvatar(owner.name)} name={owner.name} />
  <RankedItems items={ranking.items} />
  <GuessTags>
    {guessers.map(g => (
      <GuessTag
        guesser={g.name}
        guessed={g.guessedName}
        correct={g.isCorrect}
      />
    ))}
  </GuessTags>
</RevealCard>
```

---

## Critérios de Aceite

- [ ] Placar ordenado do maior para o menor score
- [ ] Jogador atual destacado com "◄" no placar
- [ ] Cada ranking revelado com nome do dono
- [ ] Tags mostram: nome do guesser + nome do chute + ✓/✗
- [ ] Botão "Play Again?" só aparece para o host
- [ ] Clicar em Play Again reseta a sala para lobby sem desconectar jogadores
- [ ] Jogadores que ficaram com 0 pontos aparecem no placar
