import { useEffect, useRef, type MutableRefObject } from 'react';

export type Tilt = { x: number; y: number };

/**
 * Parallax por giroscópio no mobile. Escuta `deviceorientation` e devolve um ref
 * com a inclinação normalizada em [-1, 1] (x = esquerda/direita, y = cima/baixo),
 * pensada para substituir o mouse no rig da câmera 3D.
 *
 * - iOS 13+ exige permissão via `DeviceOrientationEvent.requestPermission()`
 *   disparada por um gesto do usuário → pedimos no primeiro toque/clique.
 * - Calibra o "neutro" na primeira leitura (como a pessoa estiver segurando).
 * - Respeita `prefers-reduced-motion` e faz fallback silencioso se negado.
 */
export function useDeviceTilt(enabled: boolean): MutableRefObject<Tilt> {
  const tilt = useRef<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const RANGE = 26; // graus de inclinação p/ amplitude total
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

    let listening = false;
    const start = () => {
      if (listening) return;
      listening = true;
      window.addEventListener('deviceorientation', onOrient, true);
    };

    // iOS precisa de permissão sob gesto; Android/desktop escutam direto.
    const DOE = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> })
      | undefined;
    const needsPermission = !!DOE && typeof DOE.requestPermission === 'function';
    let removeGesture: (() => void) | null = null;

    if (needsPermission) {
      const requestOnce = () => {
        DOE!
          .requestPermission!()
          .then((state) => {
            if (state === 'granted') start();
          })
          .catch(() => {});
        removeGesture?.();
      };
      window.addEventListener('touchend', requestOnce, { once: true, passive: true });
      window.addEventListener('click', requestOnce, { once: true });
      removeGesture = () => {
        window.removeEventListener('touchend', requestOnce);
        window.removeEventListener('click', requestOnce);
      };
    } else {
      start();
    }

    return () => {
      window.removeEventListener('deviceorientation', onOrient, true);
      removeGesture?.();
    };
  }, [enabled]);

  return tilt;
}
