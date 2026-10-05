import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  FLOOR_Y,
  LAMP_ROWS_X,
  LAMP_Y,
  RACK_BAY,
  RACK_DEPTH,
  RACK_HEIGHT,
  RACK_LEVELS,
  RACK_X,
  Z_FAR,
  Z_NEAR,
} from './layout';
import { useBeamTexture, useCartonTexture, useConcreteTextures, useGlowTexture } from './textures';

/* ==========================================================================
   Galpão: piso de concreto polido com faixas de segurança, porta-paletes (azul
   + longarinas verde-limão, como no CD de Extrema) com cargas paletizadas, e
   luminárias industriais com halo e feixe de luz no ar.
   ========================================================================== */

const RACK_Z0 = Z_FAR - 8;
const RACK_Z1 = Z_NEAR - 2;

/**
 * Aplica as matrizes a um InstancedMesh. Roda a cada render (é barato): se o
 * objeto for recriado (ex.: troca para a versão leve), as posições voltam.
 */
function useInstances(ref: React.RefObject<THREE.InstancedMesh>, mats: THREE.Matrix4[]) {
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    mats.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  });
}

const tmp = new THREE.Object3D();
function matrix(x: number, y: number, z: number, sx: number, sy: number, sz: number, ry = 0) {
  tmp.position.set(x, y, z);
  tmp.rotation.set(0, ry, 0);
  tmp.scale.set(sx, sy, sz);
  tmp.updateMatrix();
  return tmp.matrix.clone();
}

function Floor({ lite }: { lite: boolean }) {
  const W = 40;
  const D = Z_NEAR - Z_FAR + 30;
  // Celular: textura menor e sem roughness map → reaproveita o programa de
  // shader das cargas/etiquetas (menos compilação ao abrir a página).
  const { map, roughnessMap } = useConcreteTextures(W / 6, D / 6, lite ? 256 : 512, !lite);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map,
        roughnessMap,
        roughness: lite ? 0.55 : 1,
        metalness: 0,
        envMapIntensity: 0.9,
      }),
    [map, roughnessMap, lite],
  );
  const lineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e5c21d', roughness: 0.6 }), []);
  const zc = (Z_NEAR + Z_FAR) / 2 - 8;
  const floorRef = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.InstancedMesh>(null);
  const floorMats = useMemo(() => {
    tmp.position.set(0, FLOOR_Y, zc);
    tmp.rotation.set(-Math.PI / 2, 0, 0);
    tmp.scale.set(W, D, 1);
    tmp.updateMatrix();
    return [tmp.matrix.clone()];
  }, [zc, D]);
  const lineMats = useMemo(
    () =>
      [-6.55, 6.55, -RACK_X + RACK_DEPTH / 2 + 0.55, RACK_X - RACK_DEPTH / 2 - 0.55].map((x) => {
        tmp.position.set(x, FLOOR_Y + 0.004, zc);
        tmp.rotation.set(-Math.PI / 2, 0, 0);
        tmp.scale.set(0.1, D, 1);
        tmp.updateMatrix();
        return tmp.matrix.clone();
      }),
    [zc, D],
  );
  useInstances(floorRef, floorMats);
  useInstances(lineRef, lineMats);
  return (
    <group>
      <instancedMesh ref={floorRef} args={[undefined, undefined, 1]} material={mat} receiveShadow frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
      {/* Faixas amarelas de corredor (como no CD) */}
      <instancedMesh ref={lineRef} args={[undefined, lineMat, lineMats.length]} receiveShadow frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
    </group>
  );
}

function Racks() {
  const carton = useCartonTexture();
  const uprightRef = useRef<THREE.InstancedMesh>(null);
  const beamRef = useRef<THREE.InstancedMesh>(null);
  const loadRef = useRef<THREE.InstancedMesh>(null);
  const palletRef = useRef<THREE.InstancedMesh>(null);

  const { uprights, beams, loads, pallets } = useMemo(() => {
    const uprights: THREE.Matrix4[] = [];
    const beams: THREE.Matrix4[] = [];
    const loads: THREE.Matrix4[] = [];
    const pallets: THREE.Matrix4[] = [];
    // semente fixa → o galpão é sempre igual
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    for (const side of [-1, 1]) {
      const xc = side * RACK_X;
      for (let z = RACK_Z0; z <= RACK_Z1; z += RACK_BAY) {
        for (const dx of [-RACK_DEPTH / 2, RACK_DEPTH / 2]) {
          uprights.push(matrix(xc + dx, FLOOR_Y + RACK_HEIGHT / 2, z, 0.09, RACK_HEIGHT, 0.09));
        }
        if (z + RACK_BAY > RACK_Z1) break;
        const zb = z + RACK_BAY / 2;
        for (const lvl of RACK_LEVELS) {
          const y = FLOOR_Y + lvl;
          for (const dx of [-RACK_DEPTH / 2, RACK_DEPTH / 2]) {
            beams.push(matrix(xc + dx, y, zb, 0.06, 0.13, RACK_BAY - 0.09));
          }
          // 2 posições de palete por vão; algumas vazias
          for (const pz of [-0.62, 0.62]) {
            if (rnd() < 0.14) continue;
            const py = y + 0.065;
            pallets.push(matrix(xc, py + 0.07, zb + pz, RACK_DEPTH - 0.08, 0.14, 1.1));
            const h = lvl === RACK_LEVELS[RACK_LEVELS.length - 1] ? 0.7 + rnd() * 0.5 : 0.85 + rnd() * 0.4;
            loads.push(matrix(xc + (rnd() - 0.5) * 0.06, py + 0.14 + h / 2, zb + pz, RACK_DEPTH - 0.16, h, 1.0, (rnd() - 0.5) * 0.05));
          }
        }
      }
    }
    return { uprights, beams, loads, pallets };
  }, []);

  useInstances(uprightRef, uprights);
  useInstances(beamRef, beams);
  useInstances(loadRef, loads);
  useInstances(palletRef, pallets);

  const mats = useMemo(
    () => ({
      upright: new THREE.MeshStandardMaterial({ color: '#244fa6', roughness: 0.45, metalness: 0.35 }),
      beam: new THREE.MeshStandardMaterial({ color: '#9cc63a', roughness: 0.45, metalness: 0.3 }),
      load: new THREE.MeshStandardMaterial({ map: carton, roughness: 0.62, metalness: 0, envMapIntensity: 0.6 }),
      pallet: new THREE.MeshStandardMaterial({ color: '#8a6a45', roughness: 0.9 }),
    }),
    [carton],
  );

  return (
    <group>
      <instancedMesh ref={uprightRef} args={[undefined, mats.upright, uprights.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={beamRef} args={[undefined, mats.beam, beams.length]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={palletRef} args={[undefined, mats.pallet, pallets.length]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={loadRef} args={[undefined, mats.load, loads.length]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </group>
  );
}

function Lamps({ lite }: { lite: boolean }) {
  const glow = useGlowTexture();
  const beamTex = useBeamTexture();
  const housingRef = useRef<THREE.InstancedMesh>(null);
  const diskRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const beamRef = useRef<THREE.InstancedMesh>(null);
  const BEAM_H = LAMP_Y - FLOOR_Y - 0.4;

  const spots = useMemo(() => {
    const list: { x: number; z: number }[] = [];
    // Só do meio do galpão para o fundo: perto da câmera viram "pratos" enormes no topo da tela.
    // Versão leve (celular): só as duas fileiras centrais.
    const rows = lite ? LAMP_ROWS_X.slice(0, 2) : LAMP_ROWS_X;
    for (const x of rows) for (let z = Z_FAR - 6; z <= 3; z += 6.2) list.push({ x, z });
    return list;
  }, [lite]);

  const place = (fn: (s: { x: number; z: number }) => void) =>
    spots.map((s) => {
      tmp.rotation.set(0, 0, 0);
      tmp.scale.set(1, 1, 1);
      fn(s);
      tmp.updateMatrix();
      return tmp.matrix.clone();
    });
  const housings = useMemo(() => place((s) => tmp.position.set(s.x, LAMP_Y + 0.12, s.z)), [spots]); // eslint-disable-line react-hooks/exhaustive-deps
  const disks = useMemo(
    () =>
      place((s) => {
        tmp.position.set(s.x, LAMP_Y - 0.002, s.z);
        tmp.rotation.set(Math.PI / 2, 0, 0);
      }),
    [spots], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // Halo: quad virado para a câmera (a câmera olha sempre para o fundo do galpão).
  const glows = useMemo(
    () =>
      place((s) => {
        tmp.position.set(s.x, LAMP_Y - 0.08, s.z);
        tmp.scale.set(3.2, 3.2, 1);
      }),
    [spots], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const beamMats = useMemo(() => place((s) => tmp.position.set(s.x, LAMP_Y - BEAM_H / 2, s.z)), [spots, BEAM_H]); // eslint-disable-line react-hooks/exhaustive-deps
  useInstances(housingRef, housings);
  useInstances(diskRef, disks);
  useInstances(glowRef, glows);
  useInstances(beamRef, beamMats);

  const mats = useMemo(
    () => ({
      housing: new THREE.MeshStandardMaterial({ color: '#2a3234', roughness: 0.5, metalness: 0.7 }),
      // > 1 com toneMapped=false: "estoura" como lâmpada real (e alimenta o bloom no desktop)
      disk: new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff6e6').multiplyScalar(3.2), toneMapped: false }),
      glow: new THREE.MeshBasicMaterial({
        map: glow,
        color: '#fff3dc',
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.55,
      }),
      beam: new THREE.MeshBasicMaterial({
        map: beamTex,
        color: '#fff2da',
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.075,
        side: THREE.DoubleSide,
      }),
    }),
    [glow, beamTex],
  );

  return (
    <group>
      <instancedMesh ref={housingRef} args={[undefined, mats.housing, spots.length]} frustumCulled={false}>
        <cylinderGeometry args={[0.36, 0.42, 0.24, 20, 1, true]} />
      </instancedMesh>
      <instancedMesh ref={diskRef} args={[undefined, mats.disk, spots.length]} frustumCulled={false}>
        <circleGeometry args={[0.34, 24]} />
      </instancedMesh>
      <instancedMesh ref={glowRef} args={[undefined, mats.glow, spots.length]} frustumCulled={false} renderOrder={2}>
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
      {/* Feixes de luz no ar: transparência em tela cheia é cara → só na versão completa */}
      {!lite && (
        <instancedMesh ref={beamRef} args={[undefined, mats.beam, spots.length]} frustumCulled={false} renderOrder={2}>
          <cylinderGeometry args={[0.36, 2.6, BEAM_H, 24, 1, true]} />
        </instancedMesh>
      )}
    </group>
  );
}

export function Warehouse({ lite }: { lite: boolean }) {
  return (
    <group>
      <Floor lite={lite} />
      <Racks />
      <Lamps lite={lite} />
    </group>
  );
}
