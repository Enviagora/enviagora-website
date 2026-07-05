import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { RoundedBoxGeometry } from 'three-stdlib';
import * as THREE from 'three';

/* ==========================================================================
   PackageScene — hero 3D: esteira/sorter com CAIXAS realistas.
   Material com mapa de cor (oclusão nas quinas + fita + carimbo), normal map
   (relevo de fita/vinco/papel), roughness map e reflexo de estúdio (Environment
   via Lightformers, sem rede). Cantos arredondados, sombras, variedade.
   Anima sempre. Sem pós-processamento (compatível iOS/Safari).
   ========================================================================== */

const PETROLEO = '#123336';
const BELT = '#0d2528';
const RAIL = '#20494d';
const NEON = '#c4ff57';
const KRAFT = '#e3cba7';
const CREME = '#fefaef';

const LANES = [-4.5, -1.5, 1.5, 4.5];
const BELT_W = 2.2;
const Z_NEAR = 15; // além da câmera (~13.5): caixas saem pela borda de baixo antes de reciclar
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

/** Converte um canvas de altura (grayscale) em normal map (Sobel). */
function heightToNormal(hc: HTMLCanvasElement, strength: number) {
  const s = hc.width;
  const hctx = hc.getContext('2d')!;
  const src = hctx.getImageData(0, 0, s, s).data;
  const nc = document.createElement('canvas');
  nc.width = nc.height = s;
  const nctx = nc.getContext('2d')!;
  const out = nctx.createImageData(s, s);
  const H = (x: number, y: number) => src[(((y + s) % s) * s + ((x + s) % s)) * 4] / 255;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const dx = (H(x - 1, y) - H(x + 1, y)) * strength;
      const dy = (H(x, y - 1) - H(x, y + 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * s + x) * 4;
      out.data[i] = ((dx / len) * 0.5 + 0.5) * 255;
      out.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      out.data[i + 2] = (1 / len) * 0.5 * 255 + 128;
      out.data[i + 3] = 255;
    }
  }
  nctx.putImageData(out, 0, 0);
  return new THREE.CanvasTexture(nc);
}

/** Texturas da caixa: cor (com AO), normal e roughness. */
function useBoxTextures() {
  return useMemo(() => {
    const S = 256;
    // ---- COR ----
    const cc = document.createElement('canvas');
    cc.width = cc.height = S;
    const ctx = cc.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, '#e0c8a4');
    g.addColorStop(1, '#c9ac83');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    // mottle / fibras
    for (let i = 0; i < 4200; i++) {
      const a = Math.random() * 0.05;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(90,60,30,${a})` : `rgba(255,244,220,${a})`;
      ctx.fillRect(Math.random() * S, Math.random() * S, 1.4, 1.4);
    }
    // oclusão nas bordas (AO)
    const ao = ctx.createRadialGradient(S / 2, S / 2, S * 0.28, S / 2, S / 2, S * 0.72);
    ao.addColorStop(0, 'rgba(60,40,20,0)');
    ao.addColorStop(1, 'rgba(45,30,15,0.4)');
    ctx.fillStyle = ao;
    ctx.fillRect(0, 0, S, S);
    // vinco central
    ctx.fillStyle = 'rgba(90,62,32,0.28)';
    ctx.fillRect(S / 2 - 1.5, 0, 3, S);
    // fita/lacre
    ctx.fillStyle = 'rgba(205,186,150,0.55)';
    ctx.fillRect(0, S * 0.42, S, S * 0.16);
    ctx.fillStyle = 'rgba(60,40,20,0.18)';
    ctx.fillRect(0, S * 0.42, S, 2);
    ctx.fillRect(0, S * 0.58 - 2, S, 2);
    // carimbo de manuseio (setas ↑↑) discreto
    ctx.strokeStyle = 'rgba(70,45,20,0.22)';
    ctx.lineWidth = 2;
    for (const ox of [S * 0.12, S * 0.2]) {
      ctx.beginPath();
      ctx.moveTo(ox, S * 0.82);
      ctx.lineTo(ox + 8, S * 0.72);
      ctx.lineTo(ox + 16, S * 0.82);
      ctx.moveTo(ox + 8, S * 0.72);
      ctx.lineTo(ox + 8, S * 0.9);
      ctx.stroke();
    }
    const map = new THREE.CanvasTexture(cc);
    map.anisotropy = 8;

    // ---- ALTURA -> NORMAL ----
    const hc = document.createElement('canvas');
    hc.width = hc.height = S;
    const h = hc.getContext('2d')!;
    h.fillStyle = '#808080';
    h.fillRect(0, 0, S, S);
    for (let i = 0; i < S * S * 0.4; i++) {
      const v = 128 + (Math.random() * 2 - 1) * 9;
      h.fillStyle = `rgb(${v},${v},${v})`;
      h.fillRect(Math.random() * S, Math.random() * S, 1, 1);
    }
    h.fillStyle = '#6a6a6a'; // vinco (baixo)
    h.fillRect(S / 2 - 1.5, 0, 3, S);
    h.fillStyle = '#a6a6a6'; // fita (alto)
    h.fillRect(0, S * 0.42, S, S * 0.16);
    h.fillStyle = '#c0c0c0'; // bordas da fita (mais alto)
    h.fillRect(0, S * 0.42, S, 3);
    h.fillRect(0, S * 0.58 - 3, S, 3);
    const normalMap = heightToNormal(hc, 2.2);
    normalMap.anisotropy = 8;

    // ---- ROUGHNESS ----
    const rc = document.createElement('canvas');
    rc.width = rc.height = S;
    const r = rc.getContext('2d')!;
    r.fillStyle = '#e6e6e6'; // papelão fosco
    r.fillRect(0, 0, S, S);
    r.fillStyle = '#8a8a8a'; // fita mais lisa (menos rugosa)
    r.fillRect(0, S * 0.42, S, S * 0.16);
    const roughnessMap = new THREE.CanvasTexture(rc);

    return { map, normalMap, roughnessMap };
  }, []);
}

function useLabelTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 96;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#efe9dc';
    ctx.fillRect(0, 0, 128, 96);
    ctx.strokeStyle = 'rgba(18,51,54,0.28)';
    ctx.strokeRect(2, 2, 124, 92);
    ctx.fillStyle = PETROLEO;
    ctx.fillRect(2, 2, 124, 15);
    ctx.fillStyle = NEON;
    ctx.fillRect(6, 5, 8, 8);
    ctx.fillStyle = 'rgba(240,240,235,0.85)';
    ctx.fillRect(20, 7, 38, 4);
    let x = 10;
    while (x < 118) {
      const w = 1 + Math.round(Math.random() * 3);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(x, 24, w, 26);
      x += w + 1 + Math.round(Math.random() * 3);
    }
    ctx.fillStyle = 'rgba(18,51,54,0.5)';
    ctx.fillRect(10, 58, 92, 5);
    ctx.fillRect(10, 68, 106, 5);
    ctx.fillRect(10, 78, 64, 5);
    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    return tex;
  }, []);
}

type Pkg = { lane: number; z: number; speed: number; w: number; h: number; d: number; yaw: number; shade: number };

function makePkg(lane: number, z: number): Pkg {
  const r = Math.random();
  let w: number, h: number, d: number;
  if (r < 0.16) {
    w = 1.15 + Math.random() * 0.45;
    h = 0.32 + Math.random() * 0.18;
    d = 0.9 + Math.random() * 0.4;
  } else if (r < 0.32) {
    w = 0.62 + Math.random() * 0.22;
    h = 0.95 + Math.random() * 0.3;
    d = 0.62 + Math.random() * 0.22;
  } else if (r < 0.46) {
    w = 1.15 + Math.random() * 0.3;
    h = 1.0 + Math.random() * 0.25;
    d = 1.1 + Math.random() * 0.3;
  } else {
    w = 0.82 + Math.random() * 0.32;
    h = 0.55 + Math.random() * 0.3;
    d = 0.82 + Math.random() * 0.32;
  }
  return { lane, z, speed: 3.2, w, h, d, yaw: (Math.random() - 0.5) * 0.12, shade: 0.88 + Math.random() * 0.12 };
}

function Packages() {
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const labelRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const geom = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 4, 0.08), []);
  const { map, normalMap, roughnessMap } = useBoxTextures();
  const labelTex = useLabelTexture();
  const perLane = isMobile() ? 6 : 10;
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
      dummy.scale.set(Math.min(p.w * 0.66, 0.56), Math.min(p.h * 0.58, 0.4), 1);
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
        <meshStandardMaterial map={map} normalMap={normalMap} roughnessMap={roughnessMap} metalness={0.04} envMapIntensity={0.5} />
      </instancedMesh>
      <instancedMesh ref={labelRef} args={[undefined, undefined, count]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial map={labelTex} roughness={0.85} metalness={0} />
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
            <meshStandardMaterial map={beltTex} color="#ffffff" roughness={0.9} metalness={0.1} />
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
  const target = useMemo(() => new THREE.Vector3(0, 2.4, -22), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    camera.position.x += (0.6 + px * 0.85 + Math.sin(t * 0.15) * 0.32 - camera.position.x) * 0.025;
    camera.position.y += (2.7 + py * 0.35 + Math.sin(t * 0.22) * 0.1 - camera.position.y) * 0.025;
    camera.lookAt(target);
  });
  return null;
}

export default function PackageScene() {
  const beltTex = useBeltTexture();
  const mobile = isMobile();

  return (
    <Canvas
      dpr={[1, 2]}
      shadows={!mobile}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.6, 2.7, 13.5], fov: 42 }}
    >
      <color attach="background" args={[PETROLEO]} />
      <fog attach="fog" args={[PETROLEO, 12, 42]} />

      <ambientLight color={CREME} intensity={0.5} />
      <directionalLight
        position={[5, 14, 6]}
        color={CREME}
        intensity={1.5}
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
      <directionalLight position={[-6, 4, -8]} color={NEON} intensity={0.28} />

      {/* Reflexo de estúdio (sem rede) — dá vida ao material do papelão */}
      <Environment resolution={96} frames={1}>
        <Lightformer form="rect" intensity={1.4} color="#fefaef" position={[0, 8, 3]} scale={[14, 6, 1]} rotation={[-Math.PI / 2, 0, 0]} />
        <Lightformer form="rect" intensity={0.7} color="#cfe0e4" position={[-7, 3, -2]} scale={[6, 8, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#c4ff57" position={[7, 2, 3]} scale={[5, 5, 1]} />
      </Environment>

      <Belts beltTex={beltTex} />
      <Packages />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, (Z_NEAR + Z_FAR) / 2]} receiveShadow>
        <planeGeometry args={[60, LEN + 20]} />
        <meshStandardMaterial color={PETROLEO} roughness={1} metalness={0} />
      </mesh>

      <Rig />
    </Canvas>
  );
}
