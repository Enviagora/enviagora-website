import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three-stdlib';
import * as THREE from 'three';

/* ==========================================================================
   PackageScene — hero 3D: SISTEMA DE ESTEIRAS / SORTER.
   Caixas de papelão REALISTAS (cantos arredondados, fita, etiqueta de envio,
   variedade de tamanhos, sombras) fluindo em lanes de conveyor. POV baixo:
   topo limpo p/ o título. Sem pós-processamento (compatível iOS/Safari).
   Anima sempre (o hero é decorativo e o cliente quer movimento).
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

/** Papelão fosco: gradiente + vinco + fita + ruído fino. */
function useBoxTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#dcc4a2');
    g.addColorStop(1, '#c6aa83');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    // ruído fino (fibras do papelão)
    for (let i = 0; i < 900; i++) {
      const a = Math.random() * 0.06;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(90,60,30,${a})` : `rgba(255,240,210,${a})`;
      ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 1);
    }
    // vinco central (flaps)
    ctx.strokeStyle = 'rgba(110,80,45,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.lineTo(64, 128);
    ctx.stroke();
    // fita/lacre horizontal
    ctx.fillStyle = 'rgba(222,202,166,0.7)';
    ctx.fillRect(0, 55, 128, 18);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 56);
    ctx.lineTo(128, 56);
    ctx.moveTo(0, 72);
    ctx.lineTo(128, 72);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

/** Etiqueta de envio realista: faixa da transportadora + barras + endereço. */
function useLabelTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 96;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#f4f1e8';
    ctx.fillRect(0, 0, 128, 96);
    ctx.strokeStyle = 'rgba(18,51,54,0.3)';
    ctx.strokeRect(2, 2, 124, 92);
    // cabeçalho transportadora (petróleo) + acento neon
    ctx.fillStyle = PETROLEO;
    ctx.fillRect(2, 2, 124, 16);
    ctx.fillStyle = NEON;
    ctx.fillRect(6, 6, 8, 8);
    ctx.fillStyle = 'rgba(250,250,245,0.85)';
    ctx.fillRect(20, 8, 40, 4);
    // código de barras
    let x = 10;
    while (x < 118) {
      const w = 1 + Math.round(Math.random() * 3);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x, 24, w, 28);
      x += w + 1 + Math.round(Math.random() * 3);
    }
    // linhas de endereço
    ctx.fillStyle = 'rgba(18,51,54,0.5)';
    ctx.fillRect(10, 60, 92, 5);
    ctx.fillRect(10, 70, 108, 5);
    ctx.fillRect(10, 80, 66, 5);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }, []);
}

type Pkg = { lane: number; z: number; speed: number; w: number; h: number; d: number; yaw: number; shade: number };

function makePkg(lane: number, z: number): Pkg {
  const r = Math.random();
  let w: number, h: number, d: number;
  if (r < 0.16) {
    // achatada / envelope
    w = 1.15 + Math.random() * 0.45;
    h = 0.32 + Math.random() * 0.18;
    d = 0.9 + Math.random() * 0.4;
  } else if (r < 0.32) {
    // alta
    w = 0.62 + Math.random() * 0.22;
    h = 0.95 + Math.random() * 0.3;
    d = 0.62 + Math.random() * 0.22;
  } else if (r < 0.46) {
    // grande / cúbica
    w = 1.15 + Math.random() * 0.3;
    h = 1.0 + Math.random() * 0.25;
    d = 1.1 + Math.random() * 0.3;
  } else {
    // padrão
    w = 0.82 + Math.random() * 0.32;
    h = 0.55 + Math.random() * 0.3;
    d = 0.82 + Math.random() * 0.32;
  }
  return { lane, z, speed: 3.4, w, h, d, yaw: (Math.random() - 0.5) * 0.14, shade: 0.86 + Math.random() * 0.14 };
}

function Packages({ boxTex, labelTex }: { boxTex: THREE.Texture; labelTex: THREE.Texture }) {
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const labelRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const geom = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.09), []);
  const mobile = isMobile();
  const perLane = mobile ? 5 : 8;
  const count = LANES.length * perLane;

  const pkgs = useMemo<Pkg[]>(() => {
    const list: Pkg[] = [];
    for (let li = 0; li < LANES.length; li++) {
      for (let k = 0; k < perLane; k++) {
        list.push(makePkg(LANES[li], Z_FAR + (LEN / perLane) * k + Math.random() * 0.6));
      }
    }
    return list;
  }, [perLane]);

  useFrame((_, delta) => {
    const box = boxRef.current;
    const label = labelRef.current;
    if (!box || !label) return;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < pkgs.length; i++) {
      const p = pkgs[i];
      p.z += p.speed * dt;
      if (p.z > Z_NEAR) p.z = Z_FAR + (p.z - Z_NEAR);
      const cy = p.h / 2 + 0.02;
      dummy.position.set(p.lane, cy, p.z);
      dummy.rotation.set(0, p.yaw, 0);
      dummy.scale.set(p.w, p.h, p.d);
      dummy.updateMatrix();
      box.setMatrixAt(i, dummy.matrix);
      color.setStyle(KRAFT).multiplyScalar(p.shade);
      box.setColorAt(i, color);
      const sin = Math.sin(p.yaw);
      const cos = Math.cos(p.yaw);
      const off = p.d / 2 + 0.012;
      dummy.position.set(p.lane + sin * off, cy + p.h * 0.04, p.z + cos * off);
      dummy.rotation.set(0, p.yaw, 0);
      dummy.scale.set(Math.min(p.w * 0.7, 0.6), Math.min(p.h * 0.6, 0.42), 1);
      dummy.updateMatrix();
      label.setMatrixAt(i, dummy.matrix);
    }
    box.instanceMatrix.needsUpdate = true;
    label.instanceMatrix.needsUpdate = true;
    if (box.instanceColor) box.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={boxRef} args={[geom, undefined, count]} castShadow receiveShadow>
        <meshStandardMaterial map={boxTex} roughness={0.9} metalness={0.02} />
      </instancedMesh>
      <instancedMesh ref={labelRef} args={[undefined, undefined, count]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={labelTex} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function Belts({ beltTex }: { beltTex: THREE.Texture }) {
  useFrame((_, delta) => {
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
            <mesh key={s} position={[s * (BELT_W / 2 + 0.05), 0.11, 0]} castShadow>
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

function Rig() {
  const { camera } = useThree();
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
  const boxTex = useBoxTexture();
  const labelTex = useLabelTexture();
  const mobile = isMobile();

  return (
    <Canvas
      dpr={[1, 2]}
      shadows={!mobile}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.6, 2.8, 13.5], fov: 42 }}
    >
      <color attach="background" args={[PETROLEO]} />
      <fog attach="fog" args={[PETROLEO, 12, 40]} />

      <ambientLight color={CREME} intensity={0.65} />
      <directionalLight
        position={[5, 14, 6]}
        color={CREME}
        intensity={1.7}
        castShadow={!mobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[-6, 4, -8]} color={NEON} intensity={0.32} />

      <Belts beltTex={beltTex} />
      <Packages boxTex={boxTex} labelTex={labelTex} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, (Z_NEAR + Z_FAR) / 2]} receiveShadow>
        <planeGeometry args={[60, LEN + 20]} />
        <meshStandardMaterial color={PETROLEO} roughness={1} metalness={0} />
      </mesh>

      <Rig />
    </Canvas>
  );
}
