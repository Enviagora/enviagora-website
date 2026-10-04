import logoClaro from '@/assets/brand/logo-claro.svg';
import logoEscuro from '@/assets/brand/logo-escuro.svg';
import logoMonoVerde from '@/assets/brand/logo-mono-verde.svg';

type LogoProps = {
  /**
   * Fundo onde o logo será aplicado — define a variante oficial:
   * - `light`: seta neon + wordmark verde profundo (creme, cinza névoa, branco)
   * - `dark`:  seta neon + wordmark creme (verde profundo)
   * - `neon`:  logo inteiro em verde profundo, monocromático (fundo neon)
   */
  on?: 'light' | 'dark' | 'neon';
  className?: string;
};

// Lockups oficiais do Caminho 02 "Autoridade Técnica" (assets da skill de marca).
// O wordmark ENVIAGORA nunca é recomposto em fonte — sempre o arquivo vetorial.
const SRC: Record<NonNullable<LogoProps['on']>, string> = {
  light: logoClaro,
  dark: logoEscuro,
  neon: logoMonoVerde,
};

/**
 * Logo primário da Enviagora. Controle o tamanho pela altura (ex.: `h-5`);
 * a largura acompanha a proporção. Nunca distorça, recolora ou aplique efeito.
 */
export function Logo({ on = 'light', className }: LogoProps) {
  return (
    <img
      src={SRC[on]}
      alt="Enviagora"
      className={className}
      draggable={false}
      width={768}
      height={79}
      style={{ width: 'auto' }}
    />
  );
}
