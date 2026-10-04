/** EnviAgora — Tailwind theme (Re-design 2026 · Caminho 02 "Autoridade Técnica")
 *  Base: HEX oficiais da marca (paleta preservada do redesign).
 *  Estendido com escala tipográfica, sombras e espaçamentos do design system.
 *  Regra: nada de cor/spacing hardcoded nos componentes — sempre via estes tokens.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ea: {
          // Núcleo oficial (Caminho 02 · tokens.css da marca)
          petroleo: '#123336', // Verde Profundo — primária
          'petroleo-2': '#1B4448', // verde-700 — superfície escura
          neon: '#C4FF57', // Verde Neon — acento único
          'neon-300': '#D5FF8B', // hover do botão primário
          creme: '#FAFAF5', // Creme — fundo claro padrão
          cremewm: '#FAFAF5', // wordmark/texto sobre escuro
          coolgrey: '#DEE3E0', // Cinza Névoa — fundo claro técnico
          eucalipto: '#B0C2BF', // suporte — blocos de respiro
          lilas: '#D8D6E8', // suporte — vertical beleza (uso pontual)
          // Escala do verde profundo (tokens.css) — gráficos, estados, superfícies
          'verde-900': '#0B1F21',
          'verde-700': '#1B4448',
          'verde-600': '#2A5B5F',
          'verde-500': '#3E7478',
          'verde-400': '#6A9698',
          'verde-300': '#9BBBBC',
          'verde-200': '#C6D8D8',
          'verde-100': '#E3EDEC',
          preto: '#000000',
          soft: '#2A5B5F', // verde-600 — texto secundário em fundo claro
          'soft-dark': '#9BBBBC', // verde-300 — texto secundário em fundo escuro
        },
      },
      fontFamily: {
        // "Autoridade Técnica": Satoshi é a única família — tipografia como
        // protagonista. `serif` fica apontando para Satoshi por compatibilidade
        // com classes existentes (não há mais display serif no sistema).
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.14em', // rótulos em CAIXA ALTA (kickers)
        tight: '-0.01em',
        tighter: '-0.03em',
      },
      borderRadius: {
        // Sistema técnico e angular: raios contidos. A pílula fica só nas tags.
        'ea-sm': '8px', // controles e botões
        ea: '16px', // blocos
        'ea-lg': '24px', // cards
        pill: '999px', // tags
      },
      fontSize: {
        // Manchetes e títulos em CAIXA ALTA, Satoshi Medium, tracking levemente
        // aberto (o jeitão institucional da marca). Caixa alta ocupa mais
        // espaço, por isso a escala é um pouco menor que a de caixa mista.
        'display-xl': ['clamp(2.75rem, 7vw, 6rem)', { lineHeight: '1.0', letterSpacing: '0.01em' }],
        'display-lg': ['clamp(2.25rem, 5.4vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '0.015em' }],
        'display-md': ['clamp(1.75rem, 3.8vw, 3rem)', { lineHeight: '1.1', letterSpacing: '0.02em' }],
        'display-sm': ['clamp(1.4rem, 2.6vw, 2rem)', { lineHeight: '1.15', letterSpacing: '0.02em' }],
      },
      boxShadow: {
        // sombras discretas e frias, coerentes com o petróleo (nunca pretas puras)
        'ea-sm': '0 1px 2px rgba(18, 51, 54, 0.06), 0 2px 8px rgba(18, 51, 54, 0.04)',
        ea: '0 8px 30px rgba(18, 51, 54, 0.08), 0 2px 8px rgba(18, 51, 54, 0.05)',
        'ea-lg': '0 24px 60px rgba(18, 51, 54, 0.12), 0 8px 20px rgba(18, 51, 54, 0.06)',
        'ea-neon': '0 12px 40px rgba(196, 255, 87, 0.28)',
      },
      spacing: {
        section: 'clamp(4.5rem, 10vw, 9rem)', // respiro vertical entre seções
      },
      maxWidth: {
        content: '1200px',
        wide: '1360px',
      },
      transitionTimingFunction: {
        ea: 'cubic-bezier(0.22, 1, 0.36, 1)', // easing premium (ease-out expressivo)
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'dash-draw': {
          to: { strokeDashoffset: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
