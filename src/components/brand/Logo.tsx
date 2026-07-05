type LogoProps = {
  /** Cor de fundo onde o logo será aplicado (define a variante correta). */
  on?: 'light' | 'dark';
  className?: string;
};

// Variantes oficiais (Caminho 01): seta neon + wordmark petróleo (claro) ou creme (escuro).
const SRC: Record<'light' | 'dark', string> = {
  light: '/brand/logo-fundo-claro.svg',
  dark: '/brand/logo-fundo-escuro.svg',
};

/**
 * Logo primário da Enviagora. Escolhe a variante conforme o fundo.
 * Controle a altura pela className (ex.: `h-7`). Nunca distorça — só escala.
 */
export function Logo({ on = 'light', className }: LogoProps) {
  return (
    <img
      src={SRC[on]}
      alt="Enviagora"
      className={className}
      draggable={false}
      width={240}
      height={40}
      style={{ height: 'auto' }}
    />
  );
}
