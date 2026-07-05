import { useEffect, useRef, type MutableRefObject } from 'react';

export type Tilt = { x: number; y: number };

/**
 * Parallax por giroscópio no mobile. Escuta `deviceorientation` e devolve um ref
 * com a inclinação normalizada em [-1, 1] (x = esquerda/direita, y = cima/baixo),
 * pensada para substituir o mouse no rig da câmera 3D.
 *
 * - iOS 13+ exige permissão via `DeviceOrientationEvent.requestPermission()`.
 *   Para não incomodar o usuário final com esse prompt, o efeito é DESLIGADO
 *   quando a permissão é necessária (a cena mantém o movimento idle).
 * - Onde a orientação vem sem permissão (Android/Chrome), ativa direto.
 * - Calibra o "neutro" na primeira leitura (como a pessoa estiver segurando).
 */
export function useDeviceTilt(enabled: boolean): MutableRefObject<Tilt> {
  const tilt = useRef<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const RANGE = 20; // graus de inclinação p/ amplitude total (menor = mais sensível)
    let base: { x: number; y: number } | null = null;

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      const beta = e.beta; // frente/trás (-180..180)
      const gamma = e.gamma; // esquerda/direita (-90..90)
      // Compensa a orientação da tela (landscape troca/inverte os eixos).
      const angle =
        (typeof screen !== 'undefined' && screen.orientation && screen.orientation.angle) ||
        (window as unknown as { orientation?: number }).orientation ||
        0;
      let gx = gamma;
      let gy = beta;
      if (angle === 90) {
        gx = beta;
        gy = -gamma;
      } else if (angle === 270 || angle === -90) {
        gx = -beta;
        gy = gamma;
      } else if (angle === 180) {
        gx = -gamma;
        gy = -beta;
      }
      if (!base) base = { x: gx, y: gy };
      tilt.current.x = clamp((gx - base.x) / RANGE);
      tilt.current.y = clamp(-(gy - base.y) / RANGE); // inverte p/ parallax natural
    };

    // iOS 13+ exige permissão via prompt sob gesto. Para não incomodar o usuário
    // final com essa autorização, o parallax NÃO é ativado nesses casos — a cena
    // segue com o movimento idle. Só escutamos onde a orientação vem sem permissão
    // (ex.: Android/Chrome).
    const DOE = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> })
      | undefined;
    if (!DOE || typeof DOE.requestPermission === 'function') return;

    window.addEventListener('deviceorientation', onOrient, true);
    return () => {
      window.removeEventListener('deviceorientation', onOrient, true);
    };
  }, [enabled]);

  return tilt;
}
