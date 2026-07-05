# Enviagora — Website

Site institucional (one-pager) da **Enviagora**, o fulfillment/3PL premium para marcas em escala.
Reconstruído do zero com identidade visual nova (**Re-design 2026 · Caminho 01 "Evolução Silenciosa"**),
preservando 100% do copywriting original.

> _"A única logística que funciona."_ — Logística premium / quiet scale: a operação silenciosa por trás das marcas que lideram.

---

## ✨ Stack

- **[Vite](https://vitejs.dev/)** + **React 18** + **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com/)** (tema da marca em `tailwind.config.js`)
- **[Framer Motion](https://www.framer.com/motion/)** — reveals no scroll, micro-interações, orquestração do hero
- **[GSAP](https://gsap.com/) + ScrollTrigger** — parallax scrubado (elementos decorativos)
- **[Lucide](https://lucide.dev/)** — ícones vetoriais
- **Fontes:** [Sora](https://fonts.google.com/specimen/Sora) (self-hosted) + [Fraunces](https://fonts.google.com/specimen/Fraunces) (Google Fonts, fallback Georgia)

Sem backend — SPA estático. O formulário tem um **placeholder de integração** (ver `src/sections/ContactForm.tsx`).

---

## 🚀 Como rodar

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção (type-check + Vite) → dist/
npm run preview  # serve o build de produção localmente
npm run lint     # ESLint
```

Requisitos: Node 18+ (testado em Node 22).

---

## 🧩 Importar no bolt.new

Este é um projeto Vite padrão e auto-suficiente, pronto para o [bolt.new](https://bolt.new):

1. Suba este repositório no GitHub.
2. No bolt.new, use **"Import from GitHub"** e cole a URL do repo
   (ou abra `https://bolt.new/~/github.com/USUARIO/REPO`).
3. O bolt roda `npm install` e `npm run dev` automaticamente. Sem passos extras.

Alternativa: baixe o ZIP do repositório e arraste para o bolt.new.

---

## 📁 Estrutura

```
enviagora-website/
├── index.html                  # SEO, Open Graph, preconnect de fontes
├── public/
│   ├── brand/                  # logos e grafismos SVG (claro/escuro/mono/seta/chevron)
│   ├── fonts/Sora.ttf          # fonte self-hosted
│   ├── favicon.svg             # símbolo (seta) neon
│   └── og-image.(png|svg)      # imagem de compartilhamento social
├── docs/BRANDING.md            # guia de identidade visual (Caminho 01)
├── tailwind.config.js          # tokens da marca (cores, fontes, radius, sombras, escala)
└── src/
    ├── content/content.ts      # 👈 TODO o copy verbatim (fonte única de texto)
    ├── index.css               # tokens --ea-*, base, @font-face, utilitários
    ├── components/
    │   ├── brand/              # Logo · Arrow (seta) · Chevron
    │   ├── layout/             # TopBanner · Header · Footer · Section
    │   ├── ui/                 # Button · Pill · SectionHeading · Marquee
    │   └── motion/             # RouteNetwork (hero) · Reveal · CountUp
    ├── hooks/useParallax.ts    # parallax GSAP + ScrollTrigger (respeita reduced-motion)
    ├── lib/                    # cn (classnames) · motion (presets Framer)
    └── sections/               # as 13 seções do one-pager (ver App.tsx)
```

### Onde mexer no quê
- **Textos do site:** só em `src/content/content.ts`. Nada de copy hardcoded nos componentes.
- **Cores / fontes / espaçamentos:** `tailwind.config.js` + `src/index.css` (variáveis `--ea-*`). Nunca hardcode cor.
- **Identidade/regras de marca:** `docs/BRANDING.md`.

---

## 🎨 Design system (resumo)

| Papel | Token | HEX |
|---|---|---|
| Escuro / autoridade | `ea-petroleo` | `#123336` |
| Acento único | `ea-neon` | `#C4FF57` |
| Fundo claro | `ea-creme` | `#FEFAEF` |
| Complementar | `ea-ceu` | `#C4DBE0` |
| Wellness | `ea-lavanda` | `#C9C2D6` |
| Neutro | `ea-coolgrey` | `#DEE3E0` |
| Quente / embalagem | `ea-kraft` | `#EBD9C7` |
| Contraste | `ea-preto` | `#000000` |

**Regra de ouro:** base neutra + **um** acento neon por peça. Verde neon nunca em texto corrido — só CTA, seta, realce.
**Tipografia:** títulos em **Fraunces** (serif de display) · resto + wordmark em **Sora**. **Raio:** 20px / pill.

---

## ♿ Acessibilidade & Performance

- Semântica (`header`/`main`/`section`/`nav`/`footer`), hierarquia de headings, `alt`/`aria-label`.
- Foco visível on-brand, skip-link "Pular para o conteúdo".
- **`prefers-reduced-motion` respeitado** em todas as animações (fallback estático).
- Mobile-first, responsivo (mobile → ultrawide), sem scroll horizontal.
- Fontes com `display: swap`; libs de animação em chunks separados para não travar o first paint.

---

## 📝 Pendências / placeholders (preencher com dados reais)

Estes pontos usam placeholders — **não foram inventados dados sensíveis**:

- **Rodapé:** e-mail, telefone e **CNPJ** estão vazios em `src/content/content.ts` (`footer.contato`). Links legais apontam para `#`.
- **Formulário:** `ContactForm.tsx` tem um `TODO(integração)` no `handleSubmit` — plugar o endpoint/CRM real.
- **Logos das marcas/plataformas:** exibidos como wordmarks em texto (não recebemos os SVGs oficiais). Substituir por assets reais quando disponíveis.
- **Serif oficial:** o brand usa uma serif de display comercial não confirmada; adotamos **Fraunces** (gratuita, Google Fonts) como equivalente. Trocar em `tailwind.config.js`/`index.css` se confirmarem a fonte oficial.

---

_Identidade: Enviagora Re-design — Identidade Visual, 2026 (Caminho 01). Copy: verbatim do site enviagora.com.br._
