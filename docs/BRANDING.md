# Enviagora — Branding (Re-design 2026 · Caminho 02 "Autoridade Técnica")

Resumo do sistema visual aplicado no site. A fonte da verdade é o manual
`26_06_19_Enviagora_Redesign_IdVisual` (Caminho 02) e a skill `branding-enviagora`,
que traz os HEX exatos, os SVGs oficiais do logo e os tokens CSS. O Caminho 01
(wordmark minúsculo, Fraunces/Sora, paleta lilás/céu/kraft) está **descontinuado**.

Posicionamento: infraestrutura, não serviço fofo — escala, precisão e performance,
com leitura institucional imediata. *A única logística que funciona.*

## Cores

| Cor | Token Tailwind | HEX | Papel |
|---|---|---|---|
| Verde Profundo | `ea-petroleo` | `#123336` | Primária. Fundos institucionais, texto, wordmark sobre claro |
| Verde Neon | `ea-neon` | `#C4FF57` | Acento único: seta, CTA, número, uma palavra do título |
| Creme | `ea-creme` | `#FAFAF5` | Fundo claro padrão; texto/wordmark sobre escuro |
| Cinza Névoa | `ea-coolgrey` | `#DEE3E0` | Fundo claro técnico, cards, blocos secundários |
| Eucalipto | `ea-eucalipto` | `#B0C2BF` | Suporte, uso pontual |
| Lilás | `ea-lilas` | `#D8D6E8` | Suporte, vertical beleza (pontual) |
| Escala do verde | `ea-verde-100…900` | — | Gráficos, estados, superfícies |

**Inegociável:** neon nunca como cor de texto em fundo claro (1,13:1). Neon é fundo,
acento gráfico ou número/palavra sobre fundo escuro. Um acento neon por peça.

## Tipografia — Satoshi (Fontshare)

| Papel | Classe | Peso | Caixa | Tracking |
|---|---|---|---|---|
| Manchete / título | `ea-display` + `text-display-*` | Medium 500 | CAIXA ALTA | `0.02em` |
| Rótulo / eyebrow | `ea-kicker` | Bold 700 | CAIXA ALTA | `0.14em` |
| Destaque no título | `ea-highlight` | Bold 700 | herda | herda |
| Métrica / número | `ea-metric` | Light 300 | — | tabular |
| Corpo | (padrão) | Regular 400 | caixa baixa | 0 |

## Logo

Sempre o arquivo vetorial (`src/assets/brand/`), nunca recomposto em fonte:
`<Logo on="light" />` (seta neon + wordmark verde), `on="dark"` (seta neon + creme),
`on="neon"` (monocromático verde profundo — obrigatório sobre fundo neon).
Sem opacidade, sombra, contorno ou recolor.

## Forma

Raios contidos: botões/controles 8px (`rounded-ea-sm`), blocos 16px (`rounded-ea`),
cards 24px (`rounded-ea-lg`). Pílula (`rounded-pill`) só em tags.
Botão primário: fundo neon, texto verde profundo, CAIXA ALTA, tracking 0.14em,
hover `ea-neon-300`.

## Grafismos

O símbolo (seta) em escala, sangrando na borda como marca d'água; numeração
`01 · 02 · 03` em Light grande; réguas finas de 1px; cor chapada (sem gradiente);
espaço negativo generoso.
