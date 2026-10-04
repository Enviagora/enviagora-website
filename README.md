# Enviagora — Site (tema Shopify)

Home institucional da **Enviagora** (fulfillment para marcas em escala) como **tema
Shopify**, com a identidade do Re-design 2026 · Caminho 02 "Autoridade Técnica".

Este repositório tem duas partes:

| Pasta | O que é | Quem lê |
|---|---|---|
| `layout/` `templates/` `sections/` `snippets/` `assets/` `config/` `locales/` | **O tema Shopify** (Dawn 12 + nova home). Precisa ficar na raiz da branch. | Shopify (integração GitHub) |
| `src/` `index.html` `vite.config.ts` … | **O app React** da home (fonte). O build vira arquivos `assets/enviagora-home*`. | Você / Vite |

O Shopify ignora as pastas que não são de tema, então as duas convivem na mesma branch.

---

## Como a home funciona dentro do tema

- `templates/index.json` usa o layout `enviagora` e a seção `enviagora-home`.
- `layout/enviagora.liquid` é um layout enxuto (SEO, favicon, Satoshi, rastreamento,
  `content_for_header`) **sem** o header/footer do Dawn — a home tem os próprios.
- `sections/enviagora-home.liquid` carrega `assets/enviagora-home.js` + `.css` e monta o
  app em `#enviagora-home`. No editor de tema dá para trocar os IDs do formulário HubSpot.
- `snippets/enviagora-tracking.liquid` concentra o **HubSpot tracking** (portal 44097462)
  e o **Meta Pixel** (410733041890285); é usado pelos dois layouts.
- As **demais páginas** (GemPages, `/pages/plataforma`, contato, políticas…) continuam no
  `layout/theme.liquid` do Dawn, sem mudanças.

### Formulário de contato

É o **formulário oficial do HubSpot** (portal `44097462`, form
`909bd17e-13cd-40b2-b996-96f5817b8587`, região `na1`) — o mesmo do site atual, então os
leads caem no CRM com as mesmas notificações e workflows. Ele roda num iframe do HubSpot:
campos, textos e cores do formulário se ajustam **no HubSpot**, não aqui.

---

## Desenvolvimento

```bash
npm install
npm run dev           # app em http://localhost:5173 (preview rápido, fora do Shopify)
npm run build:theme   # gera assets/enviagora-home* para o tema  ← rode antes de commitar
npm run build         # build SPA em dist/ (preview estático/bolt)
```

**Fluxo de mudança:** editar `src/` → `npm run build:theme` → commit (código **e**
`assets/`) → push. O Shopify não roda build; ele usa o que está commitado em `assets/`.
O workflow `.github/workflows/theme-build.yml` falha se os assets estiverem desatualizados.

Onde mexer:
- **Textos:** `src/content/content.ts`
- **Cores, tipografia, raios:** `tailwind.config.js` + `src/index.css` (resumo em `docs/BRANDING.md`)
- **Logos da marca / clientes / integrações:** `src/assets/`

Requisitos: Node 18+ (testado em Node 22).

---

## Conectar ao Shopify (uma vez)

1. Instale o app **Shopify GitHub** na organização `Enviagora` com acesso a este repositório.
2. No admin: **Loja virtual › Temas › Adicionar tema › Conectar do GitHub** → escolha
   `Enviagora/enviagora-website` e a branch **`main`**.
3. O tema conectado chega **despublicado**. Use **Visualizar** para revisar a home.
4. Quando aprovar: **Publicar**.

A sincronização é nos dois sentidos: push na `main` atualiza o tema; salvar no editor
de tema gera um commit do bot `shopify` na `main` (faça `git pull` antes de trabalhar).
Mais em <https://shopify.dev/docs/storefronts/themes/tools/github>.

> Dica: depois de publicado, cada push na `main` vai direto ao ar. Para ter um
> ambiente de revisão, conecte uma branch `preview` a um segundo tema despublicado.

## Colocar no domínio (DNS)

Hoje `enviagora.com.br` (raiz e www) aponta para o **HubSpot CMS**, não para o Shopify.
Para a nova home aparecer no domínio, o DNS precisa voltar para o Shopify:

1. Shopify: **Configurações › Domínios › Conectar domínio existente** → `enviagora.com.br`.
2. No provedor de DNS: registro **A** da raiz → `23.227.38.65` e **CNAME** `www` →
   `shops.myshopify.com` (confira os valores que o Shopify mostrar nessa tela).
3. No HubSpot, desconecte o domínio do site para não haver conflito de SSL/redirect.

O HubSpot continua recebendo os leads e o tracking — só deixa de hospedar a página.

---

## Pendências (fora do código)

- **HubSpot › formulário:** os textos de consentimento (LGPD) estão em cinza escuro sobre
  fundo escuro — quase invisíveis; o telefone vem com 🇺🇸 +1 como país padrão. Ajustar no
  editor de formulário do HubSpot (cor do texto rico / país padrão Brasil).
- **Shopify › Preferências:** título e meta description da página inicial (SEO).
- **Shopify › Políticas:** preencher Privacidade e Termos (o rodapé aponta para
  `/policies/privacy-policy` e `/policies/terms-of-service`).
- **Logos dos clientes:** os arquivos do site atual são pequenos (≈70–180px). SVGs ou PNGs
  maiores deixam o carrossel mais nítido em telas retina (`src/assets/clientes/`).
- **Rodapé:** e-mail, telefone e CNPJ em `src/content/content.ts` (`footer.contato`).
- **Footer do Dawn (`sections/footer.liquid`):** tem um script do Resend que espera uma API
  key no navegador. Nunca coloque uma chave real ali — ficaria pública para qualquer
  visitante (e neste repositório, que é público).
