import { useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { RoundedBoxGeometry } from 'three-stdlib';
import * as THREE from 'three';
import { useDeviceTilt, type Tilt } from '@/hooks/useDeviceTilt';

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

/** Carrega (uma vez) o logo oficial escuro para carimbar nas caixas. */
let logoPromise: Promise<HTMLImageElement | null> | null = null;
function getLogo() {
  if (!logoPromise) {
    logoPromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = '/brand/logo-oficial-escuro.png';
    });
  }
  return logoPromise;
}

/**
 * Texturas da caixa Enviagora (referência real): kraft + FITA NEON com o
 * wordmark repetido, wordmark grande impresso e tagline. Retorna mapa de cor,
 * normal (relevo de fita/papel) e roughness. O logo é o PNG oficial, carimbado
 * no canvas quando carrega → sem aparência de desenho.
 */
function useBoxTextures() {
  return useMemo(() => {
    const S = 512;
    const TAPE_Y = S * 0.31; // topo da fita
    const TAPE_H = S * 0.17; // altura da fita

    // ---- COR ----
    const cc = document.createElement('canvas');
    cc.width = cc.height = S;
    const ctx = cc.getContext('2d')!;
    // base kraft
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, '#d8b585');
    g.addColorStop(1, '#bb9058');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    // fibras / mottle
    for (let i = 0; i < 9000; i++) {
      const a = Math.random() * 0.05;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(90,60,30,${a})` : `rgba(255,244,220,${a})`;
      ctx.fillRect(Math.random() * S, Math.random() * S, 1.6, 1.6);
    }
    // oclusão nas bordas (AO)
    const ao = ctx.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S * 0.74);
    ao.addColorStop(0, 'rgba(60,40,20,0)');
    ao.addColorStop(1, 'rgba(45,28,12,0.42)');
    ctx.fillStyle = ao;
    ctx.fillRect(0, 0, S, S);
    // vinco central
    ctx.fillStyle = 'rgba(90,62,32,0.22)';
    ctx.fillRect(S / 2 - 1.5, 0, 3, S);

    // ---- FITA NEON ----
    const tg = ctx.createLinearGradient(0, TAPE_Y, 0, TAPE_Y + TAPE_H);
    tg.addColorStop(0, '#cdff67');
    tg.addColorStop(0.5, '#bff23f');
    tg.addColorStop(1, '#ace23a');
    ctx.fillStyle = tg;
    ctx.fillRect(0, TAPE_Y, S, TAPE_H);
    // brilho + bordas da fita
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(0, TAPE_Y + 3, S, 3);
    ctx.fillStyle = 'rgba(40,70,15,0.22)';
    ctx.fillRect(0, TAPE_Y, S, 1.5);
    ctx.fillRect(0, TAPE_Y + TAPE_H - 1.5, S, 1.5);

    // tagline impressa no kraft (serif itálico) + url
    ctx.fillStyle = 'rgba(18,51,54,0.7)';
    ctx.font = 'italic 500 21px Georgia, "Times New Roman", serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('A única logística que funciona.', S * 0.07, S * 0.6);
    ctx.fillStyle = 'rgba(18,51,54,0.5)';
    ctx.font = '600 12px Sora, Arial, sans-serif';
    ctx.fillText('ENVIAGORA.COM.BR', S * 0.07, S * 0.93);

    const map = new THREE.CanvasTexture(cc);
    map.anisotropy = 8;

    // Carimba o logo oficial (fita + wordmark grande) quando carregar.
    getLogo().then((img) => {
      if (!img) return;
      const ar = img.width / img.height;
      // 1) wordmark repetido na fita neon
      const lh = TAPE_H * 0.46;
      const lw = lh * ar;
      for (let x = S * 0.03; x < S; x += lw + TAPE_H * 0.85) {
        ctx.drawImage(img, x, TAPE_Y + (TAPE_H - lh) / 2, lw, lh);
      }
      // 2) wordmark grande impresso no kraft
      const bw = S * 0.62;
      const bh = bw / ar;
      ctx.drawImage(img, S * 0.07, S * 0.66, bw, bh);
      map.needsUpdate = true;
    });

    // ---- ALTURA -> NORMAL ----
    const hc = document.createElement('canvas');
    hc.width = hc.height = S;
    const h = hc.getContext('2d')!;
    h.fillStyle = '#808080';
    h.fillRect(0, 0, S, S);
    for (let i = 0; i < S * S * 0.35; i++) {
      const v = 128 + (Math.random() * 2 - 1) * 9;
      h.fillStyle = `rgb(${v},${v},${v})`;
      h.fillRect(Math.random() * S, Math.random() * S, 1, 1);
    }
    h.fillStyle = '#6a6a6a'; // vinco (baixo)
    h.fillRect(S / 2 - 1.5, 0, 3, S);
    h.fillStyle = '#9c9c9c'; // fita levemente elevada
    h.fillRect(0, TAPE_Y, S, TAPE_H);
    h.fillStyle = '#b6b6b6'; // bordas da fita (mais altas)
    h.fillRect(0, TAPE_Y, S, 3);
    h.fillRect(0, TAPE_Y + TAPE_H - 3, S, 3);
    const normalMap = heightToNormal(hc, 2.0);
    normalMap.anisotropy = 8;

    // ---- ROUGHNESS ----
    const rc = document.createElement('canvas');
    rc.width = rc.height = S;
    const r = rc.getContext('2d')!;
    r.fillStyle = '#e8e8e8'; // papelão fosco
    r.fillRect(0, 0, S, S);
    r.fillStyle = '#6f6f6f'; // fita mais lisa (brilhante)
    r.fillRect(0, TAPE_Y, S, TAPE_H);
    const roughnessMap = new THREE.CanvasTexture(rc);

    return { map, normalMap, roughnessMap };
  }, []);
}

/** Etiqueta de envio (papel branco): cabeçalho, QR, dados e código de barras. */
function useLabelTexture() {
  return useMemo(() => {
    const W = 176;
    const H = 128;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d')!;
    // papel
    ctx.fillStyle = '#f4f1e9';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(18,51,54,0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    // cabeçalho petróleo com marca
    ctx.fillStyle = PETROLEO;
    ctx.fillRect(1, 1, W - 2, 22);
    ctx.fillStyle = NEON;
    ctx.fillRect(8, 8, 9, 9);
    ctx.fillStyle = 'rgba(240,240,235,0.92)';
    ctx.font = '700 11px Sora, Arial, sans-serif';
    ctx.fillText('ENVIAGORA', 24, 16);
    // QR fake
    const qx = 9;
    const qy = 31;
    const qs = 42;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(qx - 2, qy - 2, qs + 4, qs + 4);
    const cells = 8;
    const cs = qs / cells;
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = '#12191a';
          ctx.fillRect(qx + i * cs, qy + j * cs, cs, cs);
        }
      }
    }
    // dados à direita do QR
    ctx.fillStyle = 'rgba(18,51,54,0.55)';
    for (let k = 0; k < 4; k++) {
      ctx.fillRect(60, 32 + k * 9, 62 + Math.random() * 40, 3);
    }
    // bloco preto (prioridade)
    ctx.fillStyle = '#12191a';
    ctx.fillRect(122, 30, 46, 20);
    // código de barras
    let x = 9;
    while (x < W - 12) {
      const bw = 1 + Math.round(Math.random() * 3);
      ctx.fillStyle = '#12191a';
      ctx.fillRect(x, 82, bw, 32);
      x += bw + 1 + Math.round(Math.random() * 3);
    }
    ctx.fillStyle = 'rgba(18,51,54,0.5)';
    ctx.fillRect(9, H - 9, W - 70, 4);
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
      // Cor real vem do mapa (kraft + fita neon). Aqui só variamos o brilho por
      // caixa (branco × shade) — sem tingir, senão a fita neon fica embaçada.
      color.setStyle('#ffffff').multiplyScalar(p.shade);
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

function Rig({ tiltRef }: { tiltRef: MutableRefObject<Tilt> }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 2.4, -22), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Mouse (desktop) OU giroscópio (mobile) — só um dos dois é diferente de zero.
    // O tilt entra amplificado para o parallax ser claramente perceptível ao inclinar.
    const px = state.pointer.x + tiltRef.current.x * 1.5;
    const py = state.pointer.y + tiltRef.current.y * 1.4;
    camera.position.x += (0.6 + px * 0.85 + Math.sin(t * 0.15) * 0.32 - camera.position.x) * 0.025;
    camera.position.y += (2.7 + py * 0.35 + Math.sin(t * 0.22) * 0.1 - camera.position.y) * 0.025;
    camera.lookAt(target);
  });
  return null;
}

export default function PackageScene() {
  const beltTex = useBeltTexture();
  const mobile = isMobile();
  // No mobile não há mouse → usa o giroscópio para o mesmo parallax da câmera.
  const tilt = useDeviceTilt(mobile);

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

      <Rig tiltRef={tilt} />
    </Canvas>
  );
}
