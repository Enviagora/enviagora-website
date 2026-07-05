# EnviAgora — Branding (Re-design 2026 · Caminho 01 "Evolução Silenciosa")

Guia de identidade visual para consumo por IA / Claude Code. Todo material novo da EnviAgora
deve seguir este documento. Base: PDF `Enviagora_Redesign_IdVisual` — **somente o Caminho 01**
(evolução direta da marca atual: mais refinada, silenciosa e premium, sem perder reconhecimento).

Posicionamento: a EnviAgora deixa de ser solução para PMEs e passa a ser **parceira estratégica
de operações em escala**. Tom: autoridade, precisão, sofisticação. Direção criativa:
*Logística premium / Private operation / Quiet scale* — a operação silenciosa por trás das
marcas que lideram. **Menos ruído, mais autoridade. Verde como patrimônio, não como excesso.**

---

## 1. Paleta de cores

Base predominantemente **neutra**; o **verde neon** é usado de forma estratégica só para
destaque/atenção. Tons escuros (azul petróleo, preto) trazem autoridade; bases claras
(creme, cool grey, kraft) trazem respiro. Lavanda e céu azul são complementares (universo
wellness / camada aspiracional).

| Token | Nome | HEX | RGB | Papel |
|---|---|---|---|---|
| `petroleo` | Azul Petróleo | `#123336` | 18, 51, 54 | **Cor escura principal.** Fundos escuros, texto/logo sobre claro. Autoridade. |
| `neon` | Verde Neon | `#C4FF57` | 196, 255, 87 | **Acento único.** Cor da seta do logo, CTAs, realces, destaques em data-viz. Nunca em texto corrido. |
| `creme` | Creme (off-white) | `#FEFAEF` | 254, 250, 239 | Fundo claro padrão (preferir a branco puro). Cor do wordmark sobre fundo escuro (`#FAFAF5`). |
| `ceu-azul` | Céu Azul | `#C4DBE0` | 196, 219, 224 | Complementar clara. Blocos, cards, gradientes suaves. |
| `lavanda` | Lavanda | `#C9C2D6` | 201, 194, 214 | Complementar clara (wellness/beleza). Blocos, cards, gradientes. |
| `cool-grey` | Cool Grey | `#DEE3E0` | 222, 227, 224 | Neutro claro. Fundos de seção, superfícies. |
| `light-kraft` | Light Kraft | `#EBD9C7` | 235, 217, 199 | Neutro quente. Fundos, papelão/embalagem, camada tátil. |
| `preto` | Preto | `#000000` | 0, 0, 0 | Contraste máximo, detalhes, tipografia sobre claro quando `petroleo` for suave demais. |

**Wordmark sobre escuro:** usa o creme quase branco `#FAFAF5` (variação do creme, leitura ótima).

### Combinações recomendadas
- **Escuro institucional:** fundo `petroleo` + texto `creme`/branco + acento `neon`.
- **Claro premium:** fundo `creme`/`cool-grey` + texto `petroleo` + acento `neon`.
- **Wellness/aspiracional:** blocos `lavanda` ou `ceu-azul` sobre creme, texto `petroleo`.
- **Assinatura visual:** um **único** acento neon por peça costuma bastar.
- Evite baixo contraste. **Neon nunca como cor de texto** (só fundo de botão / detalhe / gráfico).

### Contraste (acessibilidade)
- Texto `petroleo` sobre `creme` / `cool-grey` / `lavanda` / `ceu-azul` / `light-kraft` → AA ok.
- Texto `creme`/branco sobre `petroleo` → AA ok.
- **Exceção fundo neon:** só texto/logo escuro (`petroleo`/`preto`), sem detalhes coloridos.

---

## 2. Tipografia

Par tipográfico **serif de display (títulos) + geométrica sans (resto)**.

### Sans — Sora
Usada no **wordmark**, rótulos, olho, legendas, números, corpo e UI.
- Fonte: **Sora** (Google Fonts, gratuita). Pesos: Light 300 / Regular 400 no corpo;
  SemiBold 600 (peso do wordmark) / Bold 700 em destaques.
- Muito usada em **CAIXA ALTA com tracking aberto** para rótulos/kickers
  (ex.: `PALETA DE CORES`, `@ENVIAGORA`, `ENVIAGORA.COM.BR`).
- Palavra de destaque dentro de um título pode vir em **Sora Bold** ou em **verde neon**.
- Fallback: `-apple-system, "Segoe UI", Roboto, sans-serif`.

### Serif — display editorial (títulos e manchetes)
Serif de **alto contraste, editorial** (ex.: "A logística por trás das marcas que lideram.",
"Crescimento em escala."). No PDF é uma serif comercial (aparência tipo *PP Editorial New /
Reckless*). Como a fonte oficial não é confirmada, use como **fallback gratuito**:
- **Fraunces** (Google Fonts) — serif de display com contraste alto, opsz alto.
- Alternativas: *Playfair Display* (mais contraste), *Instrument Serif*, *Newsreader*.
- Fallback CSS: `Fraunces, Georgia, "Times New Roman", serif`.
- Se confirmarem a serif oficial do brand, trocar aqui e no `tokens.css`.

> Regra prática: **títulos = serif**, **tudo o mais = Sora**. Em ambientes sem as fontes
> (pptx/docx), aproximar sans por Poppins/Montserrat e serif por Playfair/Georgia.

---

## 3. Logotipo e símbolo

O logo é o lettering minimalista **`enviagora`** (tudo minúsculo, em Sora SemiBold) ao lado
da **seta ↗**. No Caminho 01 a **seta é um símbolo independente** (não substitui a letra "a")
e o wordmark fica **próximo da identidade atual**, mais refinado: proporções mais sóbrias,
espaçamento mais generoso e construção mais limpa. A seta é o símbolo/redução máxima da marca
(favicon, avatar, selo, marca d'água) e significa **direção, acesso e precisão**.

### Arquivos em `assets/` (SVG editável)
| Arquivo | Uso |
|---|---|
| `logo-fundo-escuro.svg` | **Primária p/ fundo escuro:** seta neon + wordmark creme. |
| `logo-fundo-claro.svg` | **Primária p/ fundo claro:** seta neon + wordmark petróleo. |
| `logo-mono-petroleo.svg` | Monocromático escuro (fundo claro sem acento). |
| `logo-mono-creme.svg` | Monocromático creme/branco (fundo escuro sem acento). |
| `wordmark-petroleo.svg` / `wordmark-creme.svg` | Só o lettering. |
| `simbolo-seta-neon/-petroleo/-creme.svg` | Só a seta ↗ (símbolo isolado / favicon / selo). |
| `chevron-neon/-petroleo/-creme.svg` | Grafismo secundário: chevron ↑ (usado em UI/telas). |

### Regras de aplicação
- **Fundo claro (creme, cool grey, lavanda, kraft, céu azul):** logo escuro (`petroleo`);
  sempre que o contraste permitir, **seta em verde neon** (`logo-fundo-claro.svg`).
- **Fundo escuro (petróleo):** wordmark **creme/branco** + **seta em verde neon** (`logo-fundo-escuro.svg`).
- **Exceção fundo verde neon:** logo **só em escuro**, sem detalhes coloridos.
- **Zona de proteção:** margem livre ≥ metade da altura da letra "e". Quanto mais espaço, melhor.
- **Redução mínima:** digital 40 px (símbolo/seta 7 px); impresso 15 mm (símbolo 3 mm).

### NUNCA
- Usar cores fora desta paleta no logo.
- Distorcer, inclinar ou aplicar efeitos (sombra, gradiente, contorno) no logo.
- Mudar ordem/posição das palavras ou refazer o lettering.
- Aplicar o logo sobre foto/padronagem ruidosa que prejudique a leitura.

---

## 4. Sistema visual e grafismos

- **Módulos / grid de blocos de cor:** principal recurso gráfico. Compor layouts em blocos
  (petróleo, creme, neon, lavanda, céu azul) num grid — cada bloco com um papel.
- **Cantos arredondados generosos** em cards, botões, blocos e swatches (ver `--ea-radius`).
- **Seta ↗ e chevron ↑** como elementos recorrentes: em escala grande sangrando na borda,
  como marcador em fotos/cards, ou repetidos como padrão.
- **Gradientes suaves** (creme→lavanda, verde claro→transparente) integram o sistema.
- **Silhuetas de produtos** (assets): formas flat/geométricas de frascos, potes e embalagens
  dos segmentos atendidos (beleza, cuidados pessoais, wellness, suplementos, nutracêuticos).
  Funcionam como códigos visuais dos segmentos — sem fotos ou ilustrações literais.
- **Pill tags** (rótulos arredondados) para categorias, ex.: `beleza`, `cosméticos`.
- **Fotografia:** logística real, luz natural, tom sóbrio; muitas vezes recortada em bloco
  dentro do grid, com a seta neon aplicada sobre caixas/pallets.

### Data-viz
- Base neutra; **um destaque em neon** (uma barra/ponto/área neon entre elementos petróleo).
- Área com **gradiente verde** (neon→transparente), linhas e eixos finos em petróleo.
- Números grandes em Sora (ou serif para hero), rótulo `HOJE`/kicker em Sora caixa alta neon.

---

## 5. Tokens (resumo para dev)

Ver `tokens.css` (variáveis CSS + import de fontes) e `tailwind.config.js` (tema).

```
--ea-petroleo:  #123336;
--ea-neon:      #C4FF57;
--ea-creme:     #FEFAEF;   /* wordmark s/ escuro: #FAFAF5 */
--ea-ceu-azul:  #C4DBE0;
--ea-lavanda:   #C9C2D6;
--ea-cool-grey: #DEE3E0;
--ea-kraft:     #EBD9C7;
--ea-preto:     #000000;

--ea-font-serif: "Fraunces", Georgia, serif;   /* títulos */
--ea-font-sans:  "Sora", -apple-system, sans-serif;  /* resto + wordmark */
--ea-radius:     20px;   /* cantos generosos */
```

### Botões
- **Primário:** fundo `neon` + texto `petroleo`, cantos arredondados, sem sombra.
- **Secundário (escuro):** fundo `petroleo` + texto `creme`.
- **Ghost:** borda `petroleo` sobre claro / borda `creme` sobre escuro.

---

## 6. Checklist antes de entregar
- [ ] Só cores desta paleta (HEX exatos). Base neutra, **um** acento neon.
- [ ] Títulos em serif (Fraunces/oficial); rótulos/corpo em Sora; destaque em Sora Bold ou neon.
- [ ] Variante de logo certa para o contraste; seta neon quando aplicável (só escuro em fundo neon).
- [ ] Zona de proteção respeitada; logo sem distorção/efeito/ângulo.
- [ ] Contraste AA; neon nunca como texto corrido.
- [ ] Layout em blocos/módulos, cantos arredondados, estética minimalista e premium.

---

*Referência: Enviagora Re-design — Identidade Visual, Junho 2026 (Caminho 01, pp. 1–30).
Fonte da serif oficial a confirmar com o guardião do brand. Assets deste pacote recriados em
SVG a partir do Caminho 01.*
