# Sprint 6 — Hardening

**Objetivo:** tornar o jogo confiável para uso real com amigos.
**Estimativa:** 3–4h
**Depende de:** Sprints 0–5 concluídos

---

## Escopo

Robustez, edge cases, UX de erro e expiração de sala.

---

## Tasks

### 1. AFK — jogador inativo

```typescript
// Após 3min sem resposta em qualquer fase ativa:
// update players SET is_afk = true WHERE id = ?
// Host vê badge "AFK" no jogador
// Host pode skip jogador AFK manualmente
// checkAllResponded ignora jogadores AFK
```

Implementar com `setTimeout` no container de cada fase.

### 2. Expiração de sala

```sql
-- Cron job no Supabase (pg_cron) a cada 30min:
select cron.schedule('expire-rooms', '*/30 * * * *', $$
  update rooms
  set phase = 'expired'
  where expires_at < now()
    and phase != 'expired';
$$);
```

Tela de erro pixel para sala expirada.

### 3. Reconnect

Ao recarregar qualquer página de sala:
- Verificar `localStorage` para `playerId`
- Se jogador existe na sala → reentrar na fase atual
- Se não existe → redirecionar para home com erro

### 4. Race conditions

Usar `eq('phase', currentPhase)` em todos os `update` de fase (otimistic lock).
Se update retornar 0 rows → fase já avançou, refetch e renderizar fase atual.

### 5. Validações server-side completas

```typescript
// Todas as actions devem validar:
// - Sala existe e está na fase correta
// - Jogador pertence à sala
// - Jogador não enviou resposta duplicada
// - Dados válidos (sem XSS, tamanho máximo)
```

### 6. Loading states

- Skeleton em toda tela com fetch
- Botões com estado `isPending` durante Server Action
- Spinner pixel (animação ASCII `◐ ◓ ◑ ◒`) durante transições

### 7. Error boundary

```tsx
// src/shared/components/PixelErrorBoundary.tsx
// Exibir tela de erro 8-bit genérica
// Botão "← VOLTAR AO INÍCIO"
```

### 8. Mobile

- [ ] Testar em iPhone Safari e Android Chrome
- [ ] Inputs não causam zoom (font-size >= 16px nos inputs)
- [ ] Teclado não quebra layout
- [ ] Touch targets mínimo 44px

### 9. Segurança básica

```sql
-- RLS em todas as tabelas
-- Jogador só pode inserir/atualizar dados próprios
-- Validar room_id via join, nunca confiar no client
```

### 10. PWA (opcional)

```json
// public/manifest.json
{
  "name": "RankWho",
  "short_name": "RankWho",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e",
  "icons": [...]
}
```

---

## Critérios de Aceite

- [ ] Jogador AFK não trava a sala
- [ ] Sala expirada mostra tela de erro clara
- [ ] Recarregar a página em qualquer fase funciona
- [ ] Sem erros no console em fluxo completo
- [ ] Build sem erros TypeScript (`pnpm typecheck`)
- [ ] Funciona no mobile (iOS Safari + Android Chrome)
- [ ] Não é possível enviar ranking/palpite duas vezes
