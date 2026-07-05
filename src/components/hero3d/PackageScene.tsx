import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ==========================================================================
   PackageScene — hero 3D "esteira de pacotes" (máximo cinema).
   Caixas (papelão) fluindo em lanes até um hub neon que brilha (bloom),
   luz de estúdio, drift de câmera + parallax no mouse. Fog dá profundidade.
   Lazy-loaded pela Hero; nunca monta com prefers-reduced-motion.
   ========================================================================== */

const PETROLEO = '#123336';
const NEON = '#c4ff57';
const KRAFT = '#e4cdb2';
const CREME = '#fefaef';

const HUB = new THREE.Vector3(0, 0.35, 0);

// Quantidade de caixas (menos no mobile para manter 60fps).
function boxCount() {
  if (typeof window === 'undefined') return 46;
  return window.innerWidth < 768 ? 26 : 48;
}

type Box = {
  x: number;
  y: number;
  z: number;
  speed: number;
  rx: number;
  ry: number;
  rz: number;
  s: [number, number, number];
};

const Z_START = -18;
const Z_END = 6;

function Packages() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = useMemo(boxCount, []);

  const boxes = useMemo<Box[]>(() => {
    const lanes = [-2.6, -0.9, 0.9, 2.6];
    return Array.from({ length: count }, () => {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      const base = 0.55 + Math.random() * 0.55;
      return {
        x: lane + (Math.random() - 0.5) * 0.7,
        y: -0.55 + (Math.random() - 0.5) * 0.5,
        z: Z_START + Math.random() * (Z_END - Z_START),
        speed: 1.1 + Math.random() * 1.1,
        rx: (Math.random() - 0.5) * 0.5,
        ry: Math.random() * Math.PI,
        rz: (Math.random() - 0.5) * 0.5,
        s: [base, base * (0.7 + Math.random() * 0.5), base * (0.8 + Math.random() * 0.4)],
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      b.z += b.speed * delta;
      if (b.z > Z_END) b.z = Z_START + (b.z - Z_END);
      // leve convergência das lanes em direção ao hub conforme se aproxima
      const t = THREE.MathUtils.clamp((b.z - Z_START) / (Z_END - Z_START), 0, 1);
      const converge = 1 - Math.min(1, Math.abs(b.z) / 6) * 0.35;
      dummy.position.set(b.x * converge, b.y + Math.sin(t * 6 + i) * 0.04, b.z);
      dummy.rotation.set(b.rx, b.ry + b.z * 0.05, b.rz);
      dummy.scale.set(b.s[0], b.s[1], b.s[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={KRAFT} roughness={0.82} metalness={0.05} />
    </instancedMesh>
  );
}

function Hub() {
  const core = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (core.current) core.current.rotation.y += delta * 0.35;
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.22;
      wire.current.rotation.x += delta * 0.12;
    }
  });

  return (
    <group position={HUB.toArray()}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={1.9} roughness={0.3} />
      </mesh>
      <mesh ref={wire} scale={1.35}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshBasicMaterial color={NEON} wireframe transparent opacity={0.35} />
      </mesh>
      <pointLight color={NEON} intensity={9} distance={11} decay={1.6} />
    </group>
  );
}

function Routes() {
  const curves = useMemo(() => {
    const ends: THREE.Vector3[] = [
      new THREE.Vector3(-6.5, 2.6, -3),
      new THREE.Vector3(6.5, 2.2, -2),
      new THREE.Vector3(-5.5, -1.6, -5),
      new THREE.Vector3(5.8, -1.2, -4),
      new THREE.Vector3(0.2, 3.4, -6),
    ];
    return ends.map((end) => {
      const mid = HUB.clone()
        .add(end)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 1.4, 0));
      return new THREE.QuadraticBezierCurve3(HUB.clone(), mid, end).getPoints(24).map((p) => p.toArray() as [number, number, number]);
    });
  }, []);

  return (
    <>
      {curves.map((pts, i) => (
        <Line key={i} points={pts} color={NEON} lineWidth={1} transparent opacity={0.22} />
      ))}
    </>
  );
}

function Rig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.2, 0), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    // drift lento + parallax suave no mouse
    camera.position.x += (px * 1.6 + Math.sin(t * 0.18) * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (1.2 + py * 0.8 + Math.sin(t * 0.24) * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(target);
  });
  return null;
}

export default function PackageScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.2, 8.5], fov: 42 }}
    >
      <color attach="background" args={[PETROLEO]} />
      <fog attach="fog" args={[PETROLEO, 6, 22]} />

      <ambientLight color={CREME} intensity={0.55} />
      <directionalLight position={[-6, 8, 6]} color={CREME} intensity={1.5} />
      <directionalLight position={[6, 2, -6]} color={NEON} intensity={0.5} />

      <Packages />
      <Hub />
      <Routes />

      {/* Piso discreto para ancorar a cena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={PETROLEO} roughness={1} metalness={0} />
      </mesh>

      <Rig />

      <EffectComposer>
        <Bloom intensity={0.72} luminanceThreshold={0.62} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
