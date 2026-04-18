# Skill: Pixel UI — Sistema de Design 8-bit RankWho

## Identidade Visual

**Estética:** 8-bit arcade, inspirado no Jules (google.com/jules)
**Tom:** divertido, retrô, casual — não "gamer hardcore"

---

## Tipografia

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

/* Títulos, labels, botões */
font-family: 'Press Start 2P', monospace;

/* Textos longos, listas, conteúdo (mais legível em tamanho maior) */
font-family: 'VT323', monospace;
font-size: 18px; /* mínimo para VT323 */
```

---

## Paleta

```css
:root {
  --bg:     #1a1a2e;   /* fundo principal — azul escuro */
  --paper:  #e8dcc8;   /* superfície — bege papel */
  --ink:    #1a1a2e;   /* texto sobre papel */
  --cream:  #f5efe0;   /* inputs, fundo claro */
  --green:  #4ade80;   /* ação principal, acertos */
  --yellow: #fbbf24;   /* destaque, host, score */
  --red:    #f87171;   /* erros, vidas, HP */
  --blue:   #60a5fa;   /* info secundária */
}
```

---

## PixelBox — Componente Base

Todo card/painel usa borda pixelada com shadow deslocado. **Sem border-radius.**

```tsx
// Variante padrão (papel)
<div className="pbox">...</div>

// Variante dark (ink) — para destaques e temas
<div className="pbox pbox-accent">...</div>
```

```css
.pbox {
  background: var(--paper);
  border: 4px solid var(--ink);
  box-shadow: 4px 4px 0 var(--ink);
  padding: 16px;
  image-rendering: pixelated;
}
.pbox::before {
  content: '';
  position: absolute;
  inset: 2px;
  border: 2px solid rgba(255,255,255,0.3);
  pointer-events: none;
}
.pbox-accent {
  background: var(--ink);
  color: var(--paper);
  box-shadow: 4px 4px 0 var(--green);
}
```

---

## PixelBtn

```css
.pbtn {
  font-family: 'Press Start 2P', monospace;
  font-size: 9px;
  padding: 12px 16px;
  background: var(--ink);
  color: var(--green);
  border: 4px solid var(--green);
  box-shadow: 4px 4px 0 var(--green);
  cursor: pointer;
  /* SEM transition — botão pixel é instantâneo */
}
.pbtn:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: none; /* simula pressionar físico */
}
.pbtn:hover:not(:disabled) {
  background: var(--green);
  color: var(--ink);
}
```

---

## Inputs

```css
.pinput {
  font-family: 'VT323', monospace;
  font-size: 18px;
  background: var(--cream);
  border: 4px solid var(--ink);
  box-shadow: inset 2px 2px 0 rgba(0,0,0,0.15);
  padding: 10px 12px;
  /* SEM border-radius */
  /* SEM outline padrão do browser */
}
.pinput:focus {
  box-shadow: inset 2px 2px 0 rgba(0,0,0,0.15), 0 0 0 4px var(--green);
}
```

---

## Animações

```css
/* Blink — status, cursor, elementos ativos */
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
.blink { animation: blink 1s steps(1) infinite; }

/* Bounce — sprites em espera */
@keyframes bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-8px); }
}
.bounce { animation: bounce 0.5s steps(2) infinite alternate; }

/* Scan — barra decorativa */
@keyframes scan { to { background-position: 12px 0; } }

/* Transição de tela — steps, não ease */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.screen { animation: fadeIn 0.15s steps(3) both; }
```

**Regra:** usar `steps()` ao invés de `ease` ou `linear` onde quiser feel pixel.

---

## Scanlines (fundo)

```css
body {
  background-image: repeating-linear-gradient(
    0deg,
    transparent, transparent 3px,
    rgba(255,255,255,0.015) 3px,
    rgba(255,255,255,0.015) 4px
  );
}
```

---

## Cursor Customizado

```css
body {
  cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><rect x='0' y='0' width='4' height='4' fill='%23e8dcc8'/><rect x='4' y='4' width='4' height='4' fill='%23e8dcc8'/><rect x='8' y='8' width='4' height='4' fill='%23e8dcc8'/></svg>") 0 0, auto;
}
```

---

## Proibições de Design

- ❌ `border-radius` em qualquer lugar
- ❌ `transition` em botões (pixelado é instantâneo)
- ❌ Gradientes suaves — usar degraus ou sólidos
- ❌ Sombras `blur` (box-shadow com blur) — shadow pixelada é `0 0 0` + offset
- ❌ Fontes: Inter, Roboto, System UI
- ❌ Cores intermediárias não mapeadas nas variáveis

---

## Avatares

Derivados do nome do jogador via emoji sprite:

```typescript
const SPRITES = ["🧑‍💻","🧙","🧝","🧛","🤖","👾","🦸","🧟","🐸","🐱","🦊","🐼"]
const getAvatar = (name: string) => SPRITES[name.charCodeAt(0) % SPRITES.length]
```
