type LogoProps = {
  /** Cor de fundo onde o logo será aplicado (define a variante correta). */
  on?: 'light' | 'dark';
  className?: string;
};

// Logos OFICIAIS da Enviagora (arquivos da marca).
// - fundo claro  → wordmark petróleo
// - fundo escuro → wordmark creme
const SRC: Record<'light' | 'dark', string> = {
  light: '/brand/logo-oficial-claro.png',
  dark: '/brand/logo-oficial-escuro.png',
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
      width={235}
      height={40}
    />
  );
}
