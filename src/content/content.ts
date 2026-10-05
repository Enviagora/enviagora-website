/* ==========================================================================
   EnviAgora — CONTEÚDO
   --------------------------------------------------------------------------
   FONTE ÚNICA DE TEXTO. A base é o copy do site enviagora.com.br; os textos de
   conversão novos (hero, simulador, microcopy de CTA, pós-envio) usam apenas
   números e promessas já publicados no site — nada de dado inventado.
   Ao editar textos do site, altere APENAS aqui. Os componentes só consomem
   estas constantes.
   ========================================================================== */

export const site = {
  name: 'Enviagora',
  domain: 'enviagora.com.br',
  url: 'https://enviagora.com.br',
  tagline: 'A única logística que funciona.',
  social: '@enviagorabr',
  instagram: 'https://www.instagram.com/enviagorabr',
  linkedin: 'https://www.linkedin.com/company/enviagora/',
  // Centro de distribuição (único): Extrema/MG.
  cd: { local: 'Extrema/MG', area: '15.000 m²' },
} as const;

/** Barra fina no topo: versão completa (desktop) e curta (mobile, 1 linha). */
export const topBanner = {
  lead: 'Fulfillment exclusivo para suplementos, cosméticos e nutracêuticos',
  short: 'Exclusivo para marcas com',
  highlight: '+5.000 envios/mês',
} as const;

/** Marca o link do blog: a URL real vem do tema (`getSiteConfig().blogUrl`). */
export const BLOG_HREF = 'blog';

/** Navegação (âncoras internas do one-pager + blog). Labels curtos, premium. */
export const nav = [
  { label: 'Operação', href: '#operacao' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Economia', href: '#economia' },
  { label: 'Integrações', href: '#integracoes' },
  { label: 'Dúvidas', href: '#faq' },
  { label: 'Blog', href: BLOG_HREF },
] as const;

export const hero = {
  // Eyebrow/kicker (material de branding — posicionamento do deck aprovado).
  kicker: 'Fulfillment premium para marcas em escala',
  // Assinatura verbal oficial da marca, com "única logística" em destaque.
  titlePre: 'A ',
  titleHighlight: 'única logística',
  titlePos: ' que funciona.',
  subtitle:
    'Armazenamos, embalamos e enviamos os pedidos de marcas de suplementos, cosméticos e nutracêuticos — com até 40% de economia no frete.',
  // Prova logo na dobra (números já publicados no site).
  proof: [
    { value: '+1M', label: 'pacotes por mês' },
    { value: '99,6%', label: 'de assertividade nos pedidos' },
    { value: '92%', label: 'dos pedidos enviados em até 24h' },
    { value: '15.000 m²', label: 'de CD em Extrema/MG' },
  ],
  cta: 'Falar com um especialista',
  ctaSecondary: 'Calcular minha economia',
} as const;

/** Linha de segurança sob os CTAs principais (reduz o atrito do primeiro contato). */
export const reassurance = 'Sem compromisso · um especialista retorna para entender sua operação';

export const socialProof = {
  title: 'Marcas que confiam na',
  titleBrand: 'Enviagora',
  // Clientes do carrossel (logos oficiais vetorizados em src/assets/clientes).
  // Ordem intercalando estilos (pesado/fino, largo/compacto).
  brands: [
    { name: 'Gummy Original', logo: 'gummy' },
    { name: 'AlwaysFit', logo: 'alwaysfit' },
    { name: 'Anasol', logo: 'anasol' },
    { name: 'maxfem', logo: 'maxfem' },
    { name: 'Blessy', logo: 'blessy' },
    { name: 'Hidrabene', logo: 'hidrabene' },
    { name: 'Bloom Body', logo: 'bloom' },
    { name: 'Renova Be', logo: 'renovabe' },
    { name: 'Guday', logo: 'guday' },
    { name: 'Cicatribem', logo: 'cicatribem' },
    { name: 'Aura Beauty', logo: 'aura' },
    { name: 'DermaSec', logo: 'dermasec' },
    { name: 'Popozuda', logo: 'popozuda' },
    { name: 'Zencial', logo: 'zencial' },
    { name: 'BigBoom', logo: 'bigboom' },
    { name: 'Hiven', logo: 'hiven' },
  ],
} as const;

export const niches = {
  title: 'Operação exclusiva e especializada em:',
  items: [
    {
      title: 'Suplementos e nutracêuticos',
      body: 'Atendemos marcas que exigem rastreabilidade, cuidado com o shelf life e alto giro de pedidos em todo o Brasil.',
      features: ['Controle de lotes e validades', 'Galpões com ANVISA', 'Logística B2C & B2B'],
    },
    {
      title: 'Beleza e cuidado pessoal',
      body: 'Do skincare ao haircare: logística pensada para kits, brindes, combos promocionais e embalagem com experiência.',
      features: ['Unboxing customizável', 'Sua identidade visual em cada envio', 'Kits, brindes e combos'],
    },
  ],
} as const;

export const process = {
  title: 'Cuidamos de todo o processo, do armazenamento ao envio.',
  local: 'CD ENVIAGORA · EXTREMA/MG',
  // Bloco com as fotos reais do CD.
  cd: {
    kicker: 'CD Enviagora · Extrema/MG',
    metric: '15.000 m²',
    title: 'para sua marca crescer sem travar',
    body: 'Você foca em vender; a gente garante que cada pedido saia certo e rápido. Campanha, live ou Black Friday: a mesma estrutura que já despacha mais de 1 milhão de pacotes por mês acompanha o seu ritmo.',
    // O que o cliente ganha (benefício no título, prova já publicada no texto).
    benefits: [
      { title: 'Menos troca e reclamação', body: '99,6% de assertividade nos pedidos.' },
      { title: 'Seu cliente recebe antes', body: '92% dos pedidos enviados em até 24h.' },
      { title: 'Pico de vendas sem ruptura', body: 'Espaço de sobra e estoque acompanhado ao vivo.' },
      { title: 'Produto regulado em dia', body: 'Galpões com ANVISA e controle de lote e validade.' },
    ],
    // Galeria (5 fotos do CD). A primeira é a de destaque.
    photos: [
      {
        caption: 'Cada pedido conferido e embalado com cuidado',
        alt: 'Equipe da Enviagora separando e embalando pedidos no CD, com porta-paletes e banner da marca ao fundo',
      },
      { caption: 'Estoque à venda mais rápido', alt: 'Empilhadeira retrátil com as cores da Enviagora entre porta-paletes' },
      { caption: 'Item certo, pedido certo', alt: 'Corredor entre porta-paletes altos, sinalizado como corredores C e D' },
      { caption: 'Espaço para o seu pico de vendas', alt: 'Porta-paletes de grande altura com banners da Enviagora e área de expedição' },
      { caption: 'Seu estoque seguro e rastreado', alt: 'Porta-paletes azuis e verde-limão carregados com paletes, empilhadeira ao fundo' },
    ],
  },
  steps: [
    {
      title: 'Armazenamos',
      body: 'Seu inventário sempre atualizado com rastreamento ao vivo, evitando rupturas e garantindo precisão nos envios.',
    },
    {
      title: 'Embalamos',
      body: 'Montamos e embalamos seus pedidos do jeito que sua marca precisa, incluindo kits, brindes e materiais exclusivos.',
    },
    {
      title: 'Enviamos',
      body: 'Escolhemos a transportadora ideal para cada pedido, garantindo o menor custo e rastreamento atualizado a cada etapa.',
    },
  ],
} as const;

export const logAlliance = {
  kicker: 'Economia no frete',
  title: 'Tenha acesso às melhores transportadoras',
  subtitle: 'Uma rede exclusiva de transportadoras selecionadas.',
  brand: 'LogAlliance',
  intro:
    'Para cada envio, cotamos o frete em várias transportadoras da rede e usamos sempre a mais barata da região. Sem taxas escondidas.',
  benefits: [
    { title: 'Até 40% de desconto em fretes', body: 'Desde o primeiro envio, graças à força de negociação coletiva da Enviagora.' },
    { title: 'Sem taxas escondidas', body: 'Você paga direto à transportadora, sem comissões, intermediações ou surpresas no final do mês.' },
    { title: 'Entrega rápida', body: 'Transportadoras de alta performance, focadas em agilidade, rastreio e pontualidade.' },
    { title: 'Entrega em todo Brasil', body: 'Cobertura nacional garantida pelas transportadoras da aliança.' },
  ],
} as const;

/**
 * Simulador de economia no frete: compara o frete atual da marca com o frete
 * médio da Enviagora (cerca de R$ 9 por pedido para todo o Brasil).
 */
export const calculator = {
  kicker: 'Simulador',
  title: 'Quanto você economizaria no frete?',
  ordersLabel: 'Pedidos por mês',
  ordersMin: 'mínimo 5.000',
  freightLabel: 'Seu frete médio por pedido hoje',
  oursLabel: 'Frete médio Enviagora',
  oursValue: 9,
  oursNote: 'para todo o Brasil',
  todayLabel: 'Seu frete hoje',
  resultLabel: 'Economia estimada no frete',
  perOrder: 'por pedido',
  perYear: 'por ano',
  lowNote:
    'Seu frete já está perto da nossa média. Um especialista pode avaliar prazo de entrega, incentivos fiscais e o custo total da operação.',
  disclaimer:
    'Estimativa com base no frete médio de cerca de R$ 9 por pedido na rede LogAlliance. O valor real depende de peso, dimensões, destinos e mix de pedidos.',
  cta: 'Quero essa economia',
  tax: {
    value: 'Até 60%',
    text: 'de redução de impostos com incentivos fiscais estratégicos de ICMS — avaliados caso a caso pelo especialista.',
  },
} as const;

export const tiktokShop = {
  badge: 'Nº 1 em TikTok Shop',
  title: 'A maior operação de TikTok Shop da América Latina.',
  lead: 'Somos a logística que mais entrega para o TikTok Shop no continente — mais de 1 milhão de pacotes por mês, no ritmo que as vendas virais exigem.',
  stat: { value: 1000000, suffix: '+', label: 'pacotes por mês' },
  points: [
    'Nº 1 em volume na América Latina',
    'Integração nativa com o TikTok Shop',
    'Operação pronta para picos de viral',
  ],
  cta: 'Quero escalar agora',
} as const;

export const realTime = {
  title: 'Acompanhamento em tempo real da sua operação',
  body: 'Tenha visibilidade total da sua operação com atualizações em tempo real sobre pedidos. Acompanhe o andamento de cada envio, monitore o estoque dos seus produtos no nosso centro de distribuição e identifique pontos de atenção com facilidade. Tudo isso em um painel claro e intuitivo!',
  features: [
    { title: 'Sistema WMS', body: 'Gestão da operação automatizada e eficiente.' },
    { title: 'Notificações inteligentes', body: 'Avisos de estoque e chegada de mercadoria.' },
    { title: 'Lotes e validades', body: 'Rastreie prazos e lotes com precisão, da entrada à saída.' },
  ],
  poweredBy: 'powered by aws',
} as const;

export const integrations = {
  title: 'Integração com as principais plataformas',
  subtitle: 'Conecte sua operação com poucos cliques.',
  groups: [
    {
      title: 'Plataformas de vendas',
      body: 'Sincronize pedidos e estoques em tempo real com sua loja online, sem complicações.',
      logos: ['shopify', 'nuvemshop', 'yampi', 'payt', 'b4you', 'baggy', 'youshop', 'vtext'],
    },
    {
      title: 'Marketplaces',
      body: 'Venda em grandes canais como Mercado Livre, Amazon e Shopee com logística conectada.',
      logos: ['mercadolivre', 'shopee', 'amazon', 'tiktok', 'magalu', 'shein'],
    },
    {
      title: 'ERPs',
      body: 'Conecte sistemas como Bling, Tiny e Omie para automatizar sua operação do pedido e geração da nota fiscal ao envio.',
      logos: ['bling', 'tiny', 'omie', 'sap', 'totvs', 'linx'],
    },
  ],
  cta: 'Falar sobre minha integração',
} as const;

/** "Como começar" — os 3 passos de implantação, exibidos junto do formulário. */
export const comoComecar = {
  title: 'Como começar',
  steps: [
    {
      title: 'Integração',
      body: 'Abertura do CNPJ e integração com nosso sistema, que será responsável por receber todas as suas vendas.',
    },
    {
      title: 'Estoque no CD',
      body: 'Você envia seus produtos para o centro de distribuição da Enviagora, armazenados de acordo com lotes e validades.',
    },
    {
      title: 'Operação rodando',
      body: 'Recebemos as vendas, separamos e embalamos cada pedido e deixamos pronto para coleta da transportadora.',
    },
  ],
  note: 'Implementação geralmente concluída em até 30 dias após o contrato.',
} as const;

/**
 * Cases com resultado. A seção só aparece quando houver itens — preencher apenas
 * com dados reais e aprovados pelo cliente (nada de depoimento inventado).
 */
export type CaseStudy = {
  brand: string;
  segment: string;
  /** Resultado principal, ex.: "-31%". */
  metric: string;
  metricLabel: string;
  quote: string;
  author: string;
  role: string;
};

export const cases: { kicker: string; title: string; items: CaseStudy[] } = {
  kicker: 'Resultados',
  title: 'Marcas que escalaram com a Enviagora',
  items: [],
};

export const contactForm = {
  // Copy do bloco de contato do site atual. Os campos do formulário em si vêm
  // do HubSpot (formulário 909bd17e…), não daqui.
  kicker: 'Leve sua operação para o próximo nível!',
  title: 'Estamos selecionando marcas com +5.000 envios/mês que buscam uma logística 5 estrelas',
  instruction: 'Preencha seus dados abaixo para entrar em contato com um especialista:',
  success: {
    title: 'Recebemos seus dados!',
    body: 'Um especialista da Enviagora vai entrar em contato para entender a sua operação.',
    scheduleTitle: 'Quer adiantar? Escolha um horário para conversar:',
  },
} as const;


/**
 * Formulário próprio (2 etapas). Os VALORES das opções são exatamente os do
 * formulário no HubSpot (é o que vai para o CRM); o texto exibido pode diferir
 * (ex.: o HubSpot traduziu "Tiny" como "Pequeno" — aqui aparece "Tiny").
 */
export const leadForm = {
  steps: ['Seus dados', 'Sua operação'],
  labels: {
    firstname: 'Nome',
    lastname: 'Sobrenome',
    email: 'E-mail corporativo',
    phone: 'WhatsApp ou telefone',
    website: 'Site da loja',
    orderVolume: 'Pedidos por mês',
    erp: 'ERP utilizado',
    segment: 'Segmento do produto',
    need: 'Principal necessidade',
  },
  placeholders: {
    firstname: 'Seu nome',
    lastname: 'Seu sobrenome',
    email: 'voce@suamarca.com.br',
    phone: '(11) 99999-9999',
    website: 'suamarca.com.br',
    select: 'Selecione',
  },
  orderVolume: ['Ainda não opero', 'Até 999', '1.000 a 2.999', '3.000 a 4.999', '5.000 a 9.999', '10.000 a 20.000', 'Mais de 20.000'],
  erp: [
    { label: 'Bling', value: 'Bling' },
    { label: 'Tiny', value: 'Tiny' },
    { label: 'Omie', value: 'Omie' },
    { label: 'Sankhya', value: 'Sankhya' },
    { label: 'TOTVS', value: 'TOTVS' },
    { label: 'Linx', value: 'Linx' },
    { label: 'Outro ERP', value: 'Outro ERP' },
    { label: 'Não utilizo ERP', value: 'Não utiliza ERP' },
    { label: 'Não sei informar', value: 'Não sabe informar' },
  ],
  segment: [
    'Suplementos, nutracêuticos e cosméticos',
    'Alimentos e bebidas',
    'Moda e acessórios',
    'Casa e decoração',
    'Eletrônicos',
    'Pet',
    'Outro',
  ],
  need: [
    'Terceirizar a operação de fulfillment',
    'Reduzir custo de frete',
    'Ganhar escala e capacidade operacional',
    'Melhorar armazenagem e controle de estoque',
    'Controlar lotes e validades',
    'Melhorar embalagem e experiência de unboxing',
    'Integrar loja, ERP e operação logística',
    'Outra necessidade',
  ],
  next: 'Continuar',
  back: 'Voltar',
  submit: 'Falar com um especialista',
  sending: 'Enviando…',
  errors: {
    required: 'Campo obrigatório',
    email: 'Informe um e-mail válido',
    phone: 'Informe DDD + número',
    website: 'Informe o endereço do site',
    consent: 'Precisamos do seu consentimento para continuar',
    generic: 'Não foi possível enviar agora. Tente novamente em instantes.',
  },
  fallbackTitle: 'Falta só confirmar',
  fallbackBody: 'Confira os dados abaixo (já preenchidos) e clique em Enviar para concluir.',
} as const;

export const faq = {
  title: 'Perguntas frequentes',
  items: [
    {
      q: 'O que é o serviço de fulfillment?',
      a: 'Fulfillment é o processo completo de gerenciamento de pedidos, que inclui o recebimento, armazenamento, processamento, embalagem e envio dos produtos ao cliente final.',
    },
    {
      q: 'Quais são os custos?',
      a: 'Os custos variam conforme o volume de pedidos, o tipo de produtos, e os serviços adicionais solicitados. Entre em contato com a Enviagora para uma cotação personalizada.',
    },
    {
      q: 'Quais sistemas preciso ter?',
      a: 'Para iniciar o serviço de fulfillment na sua empresa, você vai precisar de três sistemas principais',
      // Resposta com estrutura (3 blocos). Preservada na íntegra.
      blocks: [
        {
          title: 'ERP',
          body: 'Para operar você deve ter uma conta de ERP configurada com o CNPJ da sua empresa, essa plataforma serve para receber os pedidos do e-commerce, gerar as notas fiscais, emitir as etiquetas de envio e controlar o estoque. Recomendamos que você contrate um ERP que disponibilize diversas opções de integrações como Tiny ERP e Bling ERP.',
        },
        {
          title: 'E-commerce',
          body: 'Para vender online você precisa contratar uma plataforma de e-commerce, é o lugar onde você vai disponibilizar sua loja online e oferecer seus produtos. É importante contratar uma plataforma de confiança como Shopify, Nuvemshop ou Yampi.',
        },
        {
          title: 'Plataforma de fretes',
          body: 'Para disponibilizar cotações e opções de frete em seu e-commerce você precisará uma plataforma de fretes, onde as tabelas de frete da Enviagora serão configuradas para oferecer as opções mais baratas de frete para seus clientes! Recomendamos a plataforma Frenet.',
        },
      ],
    },
    {
      q: 'Como é o processo devoluções e trocas?',
      a: 'A Enviagora gerencia todo o processo de devoluções e trocas, garantindo que os produtos sejam inspecionados, recondicionados (se necessário) e reintegrados ao estoque ou descartados adequadamente.',
    },
    {
      q: 'Como a Enviagora consegue os fretes mais baratos do Brasil?',
      a: 'A Enviagora é o único fulfillment para e-commerces no Brasil que não cobra taxas escondidas em fretes. Vamos conectar a sua empresa diretamente com as transportadoras.',
    },
    {
      q: 'Como acompanho o status dos meus pedidos e estoque?',
      a: 'Você pode acompanhar o status dos pedidos e o inventário em tempo real através do painel de controle online fornecido pela Enviagora, que é intuitivo e fácil de usar.',
    },
    {
      q: 'Qual é o tempo de implementação?',
      a: 'O tempo de implementação pode variar, mas geralmente é concluído dentro de 30 dias após a finalização do contrato e abertura da filial em nosso endereço.',
    },
    {
      q: 'A Enviagora é só para e-commerce?',
      a: 'Não, não é só para e-commerce. Também operamos marcas B2B que entregam múltiplos volumes para um só cliente.',
    },
    {
      q: 'O fulfillment é para empresas de diferentes tamanhos?',
      a: 'Sim, atendemos empresas de diferentes tamanhos, mas tenha em mente que a nossa cobrança mínima é de 5.000 pedidos mensais.',
    },
    {
      q: 'Quais são os horários de operação?',
      a: 'O centro de fulfillment opera de segunda a sexta-feira, das 7h30 às 17h30, garantindo que os pedidos sejam processados e enviados dentro desse período',
    },
  ],
  footerBold: 'Ficou com dúvidas?',
  footerRest: ' Entre em contato agora mesmo com um de nossos especialistas!',
  cta: 'Tirar dúvidas com um especialista',
} as const;

/** Rodapé. Dados de contato/legais são placeholders — preencher com os reais. */
export const footer = {
  tagline: 'A única logística que funciona.',
  pitch: 'Fulfillment estratégico para e-commerces em escala.',
  cols: [
    {
      title: 'Operação',
      links: [
        { label: 'Operação exclusiva', href: '#operacao' },
        { label: 'Como funciona', href: '#como-funciona' },
        { label: 'Economia no frete', href: '#economia' },
        { label: 'Integrações', href: '#integracoes' },
        { label: 'Perguntas frequentes', href: '#faq' },
      ],
    },
    {
      title: 'Conteúdo',
      links: [
        { label: 'Blog', href: BLOG_HREF },
        { label: 'Instagram', href: site.instagram },
        { label: 'LinkedIn', href: site.linkedin },
      ],
    },
  ],
  // E-mail e telefone vazios não aparecem. CNPJ e endereço são obrigatórios no rodapé.
  contato: {
    email: '',
    telefone: '',
    razao: 'Enviagora',
    cnpj: '49.933.678/0001-16',
    endereco: {
      rua: 'Av. Joaquim Lourenço de Lima, 124',
      bairro: 'Dist. Industrial Vargem do João Pinto',
      cidade: 'Extrema/MG',
      cep: '37644-020',
    },
  },
  legal: '© 2026 Enviagora. Todos os direitos reservados.',
  legalLinks: [
    { label: 'Política de Privacidade', href: '/policies/privacy-policy' },
    { label: 'Termos de Uso', href: '/policies/terms-of-service' },
  ],
} as const;
