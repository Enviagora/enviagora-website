/* ==========================================================================
   EnviAgora — CONTEÚDO (copy verbatim do site atual)
   --------------------------------------------------------------------------
   FONTE ÚNICA DE TEXTO. Todo o copy foi extraído do site enviagora.com.br
   (one-pager) exatamente como está — sem reescrever. Ao editar textos do site,
   altere APENAS aqui. Os componentes só consomem estas constantes.
   ========================================================================== */

/** CTA recorrente usado em várias seções. */
export const CTA_ESPECIALISTA = 'Quero falar com um especialista';

export const site = {
  name: 'Enviagora',
  domain: 'enviagora.com.br',
  url: 'https://enviagora.com.br',
  tagline: 'A única logística que funciona.',
  social: '@enviagora',
  locais: ['Extrema/MG', 'São Paulo/SP'],
} as const;

/** Barra fina no topo. */
export const topBanner =
  'Exclusivo para marcas de suplementos, cosméticos e nutracêuticos com +5.000 envios/mês';

/** Navegação (âncoras internas do one-pager). Labels curtos, premium. */
export const nav = [
  { label: 'Operação', href: '#operacao' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Integrações', href: '#integracoes' },
  { label: 'Perguntas frequentes', href: '#faq' },
] as const;

export const hero = {
  // Eyebrow/kicker (material de branding — posicionamento do deck aprovado).
  kicker: 'Fulfillment premium para marcas em escala',
  // "A única logística" é destacada no site.
  titlePre: 'A ',
  titleHighlight: 'única logística',
  titlePos: ' que funciona para sua marca!',
  subtitle:
    'Cuidamos de todo o seu processo logístico, desde o armazenamento e embalagem até o envio.',
  bullets: [
    'Descontos de até 40% em fretes',
    'Economize até 60% com incentivos fiscais',
    'Localização: Extrema/MG e São Paulo/SP',
  ],
  cta: 'Falar com um especialista',
} as const;

export const socialProof = {
  title: 'Marcas de sucesso que confiam na',
  titleBrand: 'Enviagora',
  // Marcas exibidas no carrossel do site atual.
  brands: ['Gommy', 'Envy Hair', 'maxfem', 'AlwaysFit', 'POPTUDA', 'ADEUS', 'BLOOM'],
} as const;

export const niches = {
  title: 'Operação exclusiva e especializada em:',
  items: [
    {
      title: 'Suplementos e nutracêuticos',
      body: 'Atendemos marcas que exigem rastreabilidade, cuidado com o shelf life e alto giro de pedidos em todo o Brasil.',
    },
    {
      title: 'Beleza e cuidado pessoal',
      body: 'Do skincare ao haircare: logística pensada para kits, brindes, combos promocionais e embalagem com experiência.',
    },
  ],
} as const;

export const process = {
  title: 'Cuidamos de todo o processo, do armazenamento ao envio.',
  local: 'CD ENVIAGORA · EXTREMA/MG',
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
  title: 'Tenha acesso as melhores transportadoras',
  subtitle: 'A LogAlliance é formada por uma rede exclusiva de transportadoras selecionadas.',
  brand: 'LogAlliance',
  body: 'As transportadoras que integram essa aliança operam com altos padrões de eficiência e comprometimento, garantindo um serviço ágil e confiável para todos os clientes da Enviagora.',
  howTitle: 'Como funciona?',
  howBody:
    'A Enviagora negocia uma tabela de fretes com preços otimizados a partir do volume total da base de clientes. Não há taxas escondidas e os valores são cobrados diretamente pelas transportadoras.',
  cta: CTA_ESPECIALISTA,
  savingBadge: { label: 'Economia no frete', value: '+40%' },
  // Valores de frete exibidos no mapa do Brasil (referência visual).
  mapValues: ['R$ 12,56', 'R$ 11,92', 'R$ 8,92', 'R$ 8,12', 'R$ 5,58', 'R$ 7,94'],
} as const;

export const benefits = {
  items: [
    {
      title: '40% de desconto em fretes',
      body: 'Economize até 40% no frete desde o primeiro envio, graças à força de negociação coletiva da Enviagora.',
      icon: 'discount',
    },
    {
      title: 'Sem taxas escondidas',
      body: 'Você paga direto à transportadora, sem comissões, intermediações ou surpresas no final do mês.',
      icon: 'transparent',
    },
    {
      title: 'Entrega rápida',
      body: 'Parceria com transportadoras de alta performance, focadas em agilidade, rastreio e pontualidade.',
      icon: 'fast',
    },
    {
      title: 'Entrega em todo Brasil',
      body: 'Alcance clientes em qualquer estado com cobertura nacional garantida pelas transportadoras da aliança.',
      icon: 'nationwide',
    },
  ],
  cta: CTA_ESPECIALISTA,
} as const;

export const stats = {
  items: [
    { value: 60, suffix: '%', title: 'Redução de impostos', label: 'com incentivos fiscais' },
    { value: 40, suffix: '%', title: 'Redução com fretes', label: 'com a LogAlliance' },
    { value: 99.6, suffix: '%', title: 'Taxa de assertividade', label: 'nos pedidos enviados' },
    { value: 92, suffix: '%', title: 'dos pedidos enviados', label: 'em até 24 horas' },
  ],
} as const;

export const realTime = {
  title: 'Acompanhamento em tempo real da sua operação',
  body: 'Tenha visibilidade total da sua operação com atualizações em tempo real sobre pedidos. Acompanhe o andamento de cada envio, monitore o estoque dos seus produtos no nosso centro de distribuição e identifique pontos de atenção com facilidade. Tudo isso em um painel claro e intuitivo!',
  poweredBy: 'powered by aws',
} as const;

export const integrations = {
  title: 'Integração com as principais plataformas',
  subtitle: 'Conecte sua operação com poucos cliques.',
  groups: [
    {
      title: 'Plataformas de vendas',
      body: 'Sincronize pedidos e estoques em tempo real com sua loja online, sem complicações.',
      logos: ['Shopify', 'Nuvemshop', 'Yampi', 'Payt', 'Loja Integrada', 'Cartpanda'],
    },
    {
      title: 'Marketplaces',
      body: 'Venda em grandes canais como Mercado Livre, Amazon e Shopee com logística conectada.',
      logos: ['Mercado Livre', 'Shopee', 'Amazon', 'TikTok Shop', 'Magalu', 'SHEIN'],
    },
    {
      title: 'ERPs',
      body: 'Conecte sistemas como Bling, Tiny e Omie para automatizar sua operação do pedido e geração da nota fiscal ao envio.',
      logos: ['Bling', 'Tiny', 'Omie', 'SAP'],
    },
  ],
  cta: CTA_ESPECIALISTA,
} as const;

export const howFulfillment = {
  title: 'Como funciona um fulfillment?',
  subtitle: 'Você foca em vender e deixa que nós cuidamos da logística',
  steps: [
    {
      step: 'Passo 1',
      body: 'Abertura do CNPJ e integração com nosso sistema, que será responsável por receber todas as suas vendas.',
    },
    {
      step: 'Passo 2',
      body: 'Envie seus produtos para o centro de distribuição da Enviagora para armazena-los de acordo com lotes e validades.',
    },
    {
      step: 'Passo 3',
      body: 'Recebemos as vendas, separamos e embalamos cada pedido e deixamos pronto para coleta da transportadora.',
    },
  ],
} as const;

export const solution = {
  title: 'Solução completa para impulsionar a logística do seu negócio',
  features: [
    { title: 'Unboxing customizável', body: 'Surpreenda seus clientes com experiências únicas.', icon: 'gift' },
    { title: 'Logística B2C & B2B', body: 'Operamos com excelência no atacado e no varejo.', icon: 'briefcase' },
    { title: 'Incentivos fiscais', body: 'Aproveite incentivos fiscais estratégicos de ICMS.', icon: 'percent' },
    { title: 'Controle de lotes e validades', body: 'Rastreie prazos e lotes com precisão. Da entrada à saída.', icon: 'calendar' },
    { title: 'Utilize sua identidade visual', body: 'Na Enviagora a sua marca é destaque em cada envio.', icon: 'sparkles' },
    { title: 'Galpões com ANVISA', body: 'Estrutura aprovada para produtos regulamentados.', icon: 'shield' },
    { title: 'Localização estratégica', body: 'Mais agilidade com centros logísticos bem localizados.', icon: 'pin' },
    { title: 'Notificações inteligentes', body: 'Receba notificações de estoque e chegada de mercadoria.', icon: 'bell' },
    { title: 'Sistema WMS', body: 'Gestão da operação automatizada e eficiente.', icon: 'cpu' },
  ],
} as const;

export const contactForm = {
  title: 'Estamos selecionando marcas com +5.000 envios/mês que buscam uma logística 5 estrelas',
  instruction: 'Preencha seus dados abaixo para entrar em contato com um especialista:',
  fields: {
    nome: 'Nome',
    whatsapp: 'WhatsApp',
    whatsappCountry: 'Brazil (Brasil) (+55)',
    whatsappDdd: 'DDD',
    whatsappNumero: 'Número',
    empresa: 'Nome da empresa',
    site: 'Seu site',
    envios: 'Quantidade de envios por mês',
    origem: 'Como você conheceu a Enviagora?',
  },
  origemOptions: [
    'Indicação',
    'Instagram',
    'Pesquisa',
    'Vi alguém postando',
    'Conheço marcas que operam aí',
    'Conheço o Rafael',
    'Outro',
  ],
  submit: 'Enviar',
  secondaryLink: 'Não tenho +5.000 envios/mês',
  secondaryCall: 'Leve sua operação para o próximo nível!',
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
      a: 'Sim, atendemos empresas de diferentes tamanhos, mas tenha em mente que a nossa cobrança mínima é de 3.000 pedidos mensais.',
    },
    {
      q: 'Quais são os horários de operação?',
      a: 'O centro de fulfillment opera de segunda a sexta-feira, das 7h30 às 17h30, garantindo que os pedidos sejam processados e enviados dentro desse período',
    },
  ],
  footerBold: 'Ficou com dúvidas?',
  footerRest: ' Entre em contato agora mesmo com um de nossos especialistas!',
  cta: CTA_ESPECIALISTA,
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
        { label: 'Integrações', href: '#integracoes' },
        { label: 'Perguntas frequentes', href: '#faq' },
      ],
    },
    {
      title: 'Centros de distribuição',
      links: [
        { label: 'Extrema/MG', href: '#' },
        { label: 'São Paulo/SP', href: '#' },
      ],
    },
  ],
  // TODO(cliente): substituir por dados reais (não inventados).
  contato: {
    instagram: '@enviagora',
    site: 'enviagora.com.br',
    email: '', // preencher
    telefone: '', // preencher
    cnpj: '', // preencher
  },
  legal: '© 2026 Enviagora. Todos os direitos reservados.',
  legalLinks: [
    // TODO(cliente): apontar para as páginas reais quando existirem.
    { label: 'Política de Privacidade', href: '#' },
    { label: 'Termos de Uso', href: '#' },
  ],
} as const;
