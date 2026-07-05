import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ==========================================================================
   PackageScene — hero 3D: SISTEMA DE ESTEIRAS / SORTER (logística real).
   Lanes paralelas de conveyor com caixas alinhadas fluindo em direção à
   câmera, passando por um pórtico/scanner neon (estação de sorting), tudo
   recuando com profundidade (fog). Ocupa a faixa inferior — título fica limpo.
   Lazy-loaded pela Hero; nunca monta com prefers-reduced-motion.
   ========================================================================== */

const PETROLEO = '#123336';
const BELT = '#0d2528';
const RAIL = '#20494d';
const NEON = '#c4ff57';
const KRAFT = '#e4cdb2';
const CREME = '#fefaef';

const LANES = [-4.5, -1.5, 1.5, 4.5];
const BELT_W = 2.2;
const Z_NEAR = 7;
const Z_FAR = -30;
const LEN = Z_NEAR - Z_FAR;
const ACCENT_LANE = 2; // qual lane recebe o acento neon

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

/** Textura de "roletes" da esteira (linhas horizontais) para dar movimento. */
function useBeltTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = BELT;
    ctx.fillRect(0, 0, 64, 64);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 3;
    for (let y = 0; y < 64; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(64, y);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, LEN / 2.4);
    return tex;
  }, []);
}

function Belts({ beltTex }: { beltTex: THREE.Texture }) {
  const texRef = useRef(beltTex);
  useFrame((_, delta) => {
    // roletes correndo: desloca a UV no sentido do fluxo
    texRef.current.offset.y -= delta * 0.6;
  });

  return (
    <>
      {LANES.map((x, i) => (
        <group key={x} position={[x, 0, (Z_NEAR + Z_FAR) / 2]}>
          {/* superfície da esteira */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[BELT_W, LEN]} />
            <meshStandardMaterial map={beltTex} color="#ffffff" roughness={0.92} metalness={0.08} />
          </mesh>
          {/* trilhos laterais */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * (BELT_W / 2 + 0.05), 0.11, 0]}>
              <boxGeometry args={[0.1, 0.22, LEN]} />
              <meshStandardMaterial color={RAIL} metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
          {/* fita neon discreta na lane de acento */}
          {i === ACCENT_LANE && (
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.04, 0.02, LEN]} />
              <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={0.75} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

type Pkg = { lane: number; z: number; speed: number; w: number; h: number; d: number; yaw: number; shade: number };

function Packages() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const perLane = isMobile() ? 5 : 8;
  const count = LANES.length * perLane;

  const pkgs = useMemo<Pkg[]>(() => {
    const list: Pkg[] = [];
    for (let li = 0; li < LANES.length; li++) {
      const speed = 3.4; // esteira anda em velocidade constante (realista)
      for (let k = 0; k < perLane; k++) {
        list.push({
          lane: LANES[li],
          z: Z_FAR + (LEN / perLane) * k + Math.random() * 0.6,
          speed,
          w: 0.8 + Math.random() * 0.5,
          h: 0.5 + Math.random() * 0.35,
          d: 0.8 + Math.random() * 0.5,
          yaw: (Math.random() - 0.5) * 0.12,
          shade: 0.82 + Math.random() * 0.18,
        });
      }
    }
    return list;
  }, [perLane]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < pkgs.length; i++) {
      const p = pkgs[i];
      p.z += p.speed * delta;
      if (p.z > Z_NEAR) p.z = Z_FAR + (p.z - Z_NEAR);
      dummy.position.set(p.lane, p.h / 2 + 0.02, p.z);
      dummy.rotation.set(0, p.yaw, 0);
      dummy.scale.set(p.w, p.h, p.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setStyle(KRAFT).multiplyScalar(p.shade);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={KRAFT} roughness={0.85} metalness={0.03} />
    </instancedMesh>
  );
}

/** Pórtico/scanner neon — estação de sorting por onde as caixas passam. */
function ScannerGantry({ z }: { z: number }) {
  const span = 12;
  const h = 3;
  const beamMat = (
    <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={1.7} roughness={0.4} />
  );
  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (span / 2), h / 2, 0]}>
          <boxGeometry args={[0.16, h, 0.16]} />
          {beamMat}
        </mesh>
      ))}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[span + 0.16, 0.16, 0.16]} />
        {beamMat}
      </mesh>
      {/* plano de leitura (scan) */}
      <mesh position={[0, h / 2, 0]}>
        <planeGeometry args={[span, h]} />
        <meshBasicMaterial color={NEON} transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <pointLight color={NEON} intensity={7} distance={12} decay={1.7} position={[0, h * 0.7, 0]} />
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  // POV baixo (cabeceira da esteira): horizonte fica embaixo, topo limpo p/ título.
  const target = useMemo(() => new THREE.Vector3(0, 1.7, -20), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    camera.position.x += (0.6 + px * 0.9 + Math.sin(t * 0.15) * 0.35 - camera.position.x) * 0.025;
    camera.position.y += (2.8 + py * 0.4 + Math.sin(t * 0.22) * 0.12 - camera.position.y) * 0.025;
    camera.lookAt(target);
  });
  return null;
}

export default function PackageScene() {
  const beltTex = useBeltTexture();
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.6, 2.8, 13.5], fov: 42 }}
    >
      <color attach="background" args={[PETROLEO]} />
      <fog attach="fog" args={[PETROLEO, 12, 40]} />

      <ambientLight color={CREME} intensity={0.5} />
      {/* luz de galpão (zenital) */}
      <directionalLight position={[3, 12, 4]} color={CREME} intensity={1.35} />
      <directionalLight position={[-6, 4, -8]} color={NEON} intensity={0.35} />

      <Belts beltTex={beltTex} />
      <Packages />
      <ScannerGantry z={-21} />

      {/* piso do galpão */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, (Z_NEAR + Z_FAR) / 2]}>
        <planeGeometry args={[60, LEN + 20]} />
        <meshStandardMaterial color={PETROLEO} roughness={1} metalness={0} />
      </mesh>

      <Rig />

      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
