import { Suspense, lazy, useMemo, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceTilt, type Tilt } from '@/hooks/useDeviceTilt';
import { CREME, HAZE, LAMP_ROWS_X, LAMP_Y, isMobile } from './layout';
import { Warehouse } from './Warehouse';
import { Conveyors } from './Conveyors';
import { Packages } from './Packages';

/* ==========================================================================
   PackageScene — hero 3D fotorrealista: linhas de transportadores de roletes
   dentro de um galpão (porta-paletes, luminárias, concreto polido), com
   caixas Enviagora andando em direção à câmera.

   Realismo vem de: materiais físicos (metal galvanizado, papelão com relevo,
   fita com verniz), reflexos das luminárias (Environment com Lightformers,
   sem rede), sombras (shadow map + sombra de contato), névoa de galpão,
   tone mapping AgX e — só no desktop — oclusão ambiente, bloom das
   lâmpadas, profundidade de campo, vinheta e grão de filme. Um monitor de
   desempenho derruba esses extras se o aparelho não sustentar a animação.
   ========================================================================== */

// Pós-processamento só no desktop: chunk separado (o mobile nem baixa).
const Effects = lazy(() => import('./Effects'));

function Rig({ tiltRef }: { tiltRef: MutableRefObject<Tilt> }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 1.6, -22), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Mouse (desktop) OU giroscópio (mobile): parallax suave + respiração lenta.
    const px = state.pointer.x + tiltRef.current.x * 1.5;
    const py = state.pointer.y + tiltRef.current.y * 1.4;
    camera.position.x += (0.5 + px * 0.7 + Math.sin(t * 0.13) * 0.28 - camera.position.x) * 0.022;
    camera.position.y += (2.35 + py * 0.3 + Math.sin(t * 0.19) * 0.07 - camera.position.y) * 0.022;
    camera.lookAt(target);
  });
  return null;
}

export default function PackageScene() {
  const mobile = isMobile();
  const tilt = useDeviceTilt(mobile);
  // Qualidade adaptativa: se o aparelho não sustenta a taxa de quadros, a cena
  // tira o pós-processamento e os feixes de luz e baixa a resolução.
  const [degraded, setDegraded] = useState(false);
  const lite = mobile || degraded;
  const maxDpr = degraded ? 1 : mobile ? 1.75 : 1.5;

  return (
    <Canvas
      dpr={[1, maxDpr]}
      shadows={mobile ? false : 'soft'}
      gl={{ antialias: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ position: [0.5, 2.35, 13.2], fov: 38, near: 0.5, far: 90 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.AgXToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={[HAZE]} />
      <fog attach="fog" args={[HAZE, 11, 46]} />

      {/* Luz de galpão: céu neutro, chão escuro + luminárias (key) por cima */}
      <hemisphereLight args={['#e9eef0', '#1b2a2c', 0.55]} />
      <directionalLight
        position={[3, 16, 6]}
        color="#fff6e8"
        intensity={2.1}
        castShadow={!mobile}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Preenchimento frio vindo do fundo do galpão (recorte nas bordas) */}
      <directionalLight position={[-4, 5, -20]} color="#cfe3e6" intensity={0.45} />
      {/* Preenchimento quente do lado da câmera (kraft não fica esverdeado) */}
      <directionalLight position={[0, 3, 16]} color="#ffe2bd" intensity={0.35} />

      {/* Reflexos: as mesmas fileiras de luminárias + paredes claras ao longe */}
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        {LAMP_ROWS_X.slice(0, 2).map((x) =>
          [-24, -12, 0, 12].map((z) => (
            <Lightformer
              key={`${x}:${z}`}
              form="circle"
              intensity={4}
              color="#fff4e2"
              position={[x, LAMP_Y, z]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={1.4}
            />
          )),
        )}
        <Lightformer form="rect" intensity={0.6} color={CREME} position={[0, 4, -30]} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={0.35} color="#cfe3e6" position={[-14, 3, 0]} rotation={[0, Math.PI / 2, 0]} scale={[40, 6, 1]} />
        <Lightformer form="rect" intensity={0.35} color="#cfe3e6" position={[14, 3, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[40, 6, 1]} />
      </Environment>

      {/* Limite fixo: abaixo de ~36 FPS sustentados (75% das amostras de 2,5 s) a cena fica leve. */}
      <PerformanceMonitor flipflops={1} bounds={() => [36, 1000]} onDecline={() => setDegraded(true)} />

      <Warehouse lite={lite} />
      <Conveyors mobile={mobile} />
      <Packages mobile={mobile} />

      <Rig tiltRef={tilt} />

      {!lite && (
        <Suspense fallback={null}>
          <Effects />
        </Suspense>
      )}
    </Canvas>
  );
}
