/** EnviAgora — Tailwind theme (Re-design 2026 · Caminho 01 "Evolução Silenciosa")
 *  Base: enviagora-branding-caminho01/tailwind.config.js (HEX oficiais da marca).
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
          petroleo: '#123336',
          'petroleo-2': '#1B4145', // superfície escura (surface no tema dark)
          neon: '#C4FF57',
          creme: '#FEFAEF',
          cremewm: '#FAFAF5', // wordmark sobre escuro
          ceu: '#C4DBE0',
          lavanda: '#C9C2D6',
          coolgrey: '#DEE3E0',
          kraft: '#EBD9C7',
          preto: '#000000',
          soft: '#3A5457', // texto secundário (petróleo suavizado)
          'soft-dark': '#AEC3C0', // texto secundário sobre escuro
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'], // títulos
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'], // resto + wordmark
      },
      letterSpacing: {
        label: '0.14em', // rótulos em CAIXA ALTA (kickers)
        tight: '-0.01em',
        tighter: '-0.03em',
      },
      borderRadius: {
        ea: '20px',
        'ea-lg': '28px',
        'ea-sm': '10px',
        pill: '999px',
      },
      fontSize: {
        // escala editorial — display grande em serif
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.03', letterSpacing: '-0.015em' }],
        'display-sm': ['clamp(1.6rem, 3.2vw, 2.4rem)', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
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
