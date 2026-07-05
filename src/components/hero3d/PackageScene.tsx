import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ==========================================================================
   PackageScene — hero 3D: SISTEMA DE ESTEIRAS / SORTER (logística real).
   Lanes paralelas de conveyor com CAIXAS realistas (papelão + fita + etiqueta
   de envio) fluindo em direção à câmera. POV baixo: topo limpo p/ o título.
   Sem pós-processamento (compatível com iOS/Safari). Lazy-loaded pela Hero.
   `paused` (reduced-motion) renderiza um único frame estático.
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
const ACCENT_LANE = 2;

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

/** Textura de "roletes" da esteira (linhas horizontais). */
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

/** Textura de caixa de papelão: base + lacre/fita + vinco central. */
function useBoxTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    // base papelão com leve gradiente
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#e7d0b3');
    g.addColorStop(1, '#d3b892');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    // vinco central (flaps)
    ctx.strokeStyle = 'rgba(120,90,55,0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(64, 128);
    ctx.stroke();
    // fita/lacre horizontal
    ctx.fillStyle = 'rgba(226,206,170,0.75)';
    ctx.fillRect(0, 54, 128, 20);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 55);
    ctx.lineTo(128, 55);
    ctx.moveTo(0, 73);
    ctx.lineTo(128, 73);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

/** Textura de etiqueta de envio: código de barras + linhas de endereço. */
function useLabelTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 96;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#fafaf5';
    ctx.fillRect(0, 0, 128, 96);
    ctx.strokeStyle = 'rgba(18,51,54,0.25)';
    ctx.strokeRect(2, 2, 124, 92);
    // faixa superior (transportadora) com acento neon
    ctx.fillStyle = NEON;
    ctx.fillRect(2, 2, 124, 14);
    ctx.fillStyle = '#123336';
    ctx.fillRect(8, 6, 34, 6);
    // código de barras
    let x = 10;
    while (x < 118) {
      const w = 1 + Math.round(Math.random() * 3);
      ctx.fillStyle = '#123336';
      ctx.fillRect(x, 22, w, 30);
      x += w + 1 + Math.round(Math.random() * 3);
    }
    // linhas de endereço
    ctx.fillStyle = 'rgba(18,51,54,0.55)';
    ctx.fillRect(10, 60, 90, 5);
    ctx.fillRect(10, 70, 108, 5);
    ctx.fillRect(10, 80, 70, 5);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

type Pkg = { lane: number; z: number; speed: number; w: number; h: number; d: number; yaw: number; shade: number };

function Packages({ boxTex, labelTex }: { boxTex: THREE.Texture; labelTex: THREE.Texture }) {
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const labelRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const perLane = isMobile() ? 5 : 8;
  const count = LANES.length * perLane;

  const pkgs = useMemo<Pkg[]>(() => {
    const list: Pkg[] = [];
    for (let li = 0; li < LANES.length; li++) {
      for (let k = 0; k < perLane; k++) {
        list.push({
          lane: LANES[li],
          z: Z_FAR + (LEN / perLane) * k + Math.random() * 0.6,
          speed: 3.4,
          w: 0.85 + Math.random() * 0.5,
          h: 0.55 + Math.random() * 0.4,
          d: 0.85 + Math.random() * 0.5,
          yaw: (Math.random() - 0.5) * 0.14,
          shade: 0.85 + Math.random() * 0.15,
        });
      }
    }
    return list;
  }, [perLane]);

  useFrame((_, delta) => {
    const box = boxRef.current;
    const label = labelRef.current;
    if (!box || !label) return;
    const d = Math.min(delta, 0.05); // clamp p/ evitar salto após aba inativa
    for (let i = 0; i < pkgs.length; i++) {
      const p = pkgs[i];
      p.z += p.speed * d;
      if (p.z > Z_NEAR) p.z = Z_FAR + (p.z - Z_NEAR);
      const cy = p.h / 2 + 0.02;
      // caixa
      dummy.position.set(p.lane, cy, p.z);
      dummy.rotation.set(0, p.yaw, 0);
      dummy.scale.set(p.w, p.h, p.d);
      dummy.updateMatrix();
      box.setMatrixAt(i, dummy.matrix);
      color.setStyle(KRAFT).multiplyScalar(p.shade);
      box.setColorAt(i, color);
      // etiqueta na face frontal (+Z), acompanhando o yaw
      const sin = Math.sin(p.yaw);
      const cos = Math.cos(p.yaw);
      const off = p.d / 2 + 0.012;
      dummy.position.set(p.lane + sin * off, cy + p.h * 0.05, p.z + cos * off);
      dummy.rotation.set(0, p.yaw, 0);
      dummy.scale.set(Math.min(p.w * 0.72, 0.62), Math.min(p.h * 0.62, 0.46), 1);
      dummy.updateMatrix();
      label.setMatrixAt(i, dummy.matrix);
    }
    box.instanceMatrix.needsUpdate = true;
    label.instanceMatrix.needsUpdate = true;
    if (box.instanceColor) box.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={boxRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial map={boxTex} roughness={0.82} metalness={0.02} />
      </instancedMesh>
      <instancedMesh ref={labelRef} args={[undefined, undefined, count]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={labelTex} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function Belts({ beltTex, paused }: { beltTex: THREE.Texture; paused: boolean }) {
  useFrame((_, delta) => {
    if (paused) return;
    beltTex.offset.y -= Math.min(delta, 0.05) * 0.6;
  });
  return (
    <>
      {LANES.map((x, i) => (
        <group key={x} position={[x, 0, (Z_NEAR + Z_FAR) / 2]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[BELT_W, LEN]} />
            <meshStandardMaterial map={beltTex} color="#ffffff" roughness={0.92} metalness={0.08} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * (BELT_W / 2 + 0.05), 0.11, 0]}>
              <boxGeometry args={[0.1, 0.22, LEN]} />
              <meshStandardMaterial color={RAIL} metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
          {i === ACCENT_LANE && (
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.04, 0.02, LEN]} />
              <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={0.8} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

function Rig({ paused }: { paused: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 1.7, -20), []);
  useFrame((state) => {
    if (paused) {
      camera.lookAt(target);
      return;
    }
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    camera.position.x += (0.6 + px * 0.9 + Math.sin(t * 0.15) * 0.35 - camera.position.x) * 0.025;
    camera.position.y += (2.8 + py * 0.4 + Math.sin(t * 0.22) * 0.12 - camera.position.y) * 0.025;
    camera.lookAt(target);
  });
  return null;
}

export default function PackageScene({ paused = false }: { paused?: boolean }) {
  const beltTex = useBeltTexture();
  const boxTex = useBoxTexture();
  const labelTex = useLabelTexture();

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={paused ? 'demand' : 'always'}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.6, 2.8, 13.5], fov: 42 }}
    >
      <color attach="background" args={[PETROLEO]} />
      <fog attach="fog" args={[PETROLEO, 12, 40]} />

      <ambientLight color={CREME} intensity={0.7} />
      <directionalLight position={[3, 12, 4]} color={CREME} intensity={1.6} />
      <directionalLight position={[-6, 4, -8]} color={NEON} intensity={0.35} />

      <Belts beltTex={beltTex} paused={paused} />
      <Packages boxTex={boxTex} labelTex={labelTex} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, (Z_NEAR + Z_FAR) / 2]}>
        <planeGeometry args={[60, LEN + 20]} />
        <meshStandardMaterial color={PETROLEO} roughness={1} metalness={0} />
      </mesh>

      <Rig paused={paused} />
    </Canvas>
  );
}
