import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three-stdlib';
import * as THREE from 'three';
import { LANES, LEN, Z_FAR, Z_NEAR } from './layout';
import { useBoxTextures, useContactShadowTexture, useLabelTexture, useTapeTexture } from './textures';

/* ==========================================================================
   Caixas Enviagora andando nos roletes: kraft com normal/roughness, fita neon
   em 3D, etiqueta de envio, sombra de contato macia (também no mobile, onde
   não há shadow map) e uma trepidação sutil ao cruzar cada rolete.
   ========================================================================== */

type Pkg = { lane: number; z: number; speed: number; w: number; h: number; d: number; yaw: number; shade: number; phase: number };

const LANE_SPEED = [3.0, 3.35, 3.15, 2.85];

function makePkg(laneIdx: number, z: number): Pkg {
  const r = Math.random();
  let w: number, h: number, d: number;
  if (r < 0.16) {
    w = 1.15 + Math.random() * 0.4;
    h = 0.32 + Math.random() * 0.16;
    d = 0.9 + Math.random() * 0.35;
  } else if (r < 0.32) {
    w = 0.62 + Math.random() * 0.22;
    h = 0.95 + Math.random() * 0.28;
    d = 0.62 + Math.random() * 0.22;
  } else if (r < 0.46) {
    w = 1.15 + Math.random() * 0.28;
    h = 1.0 + Math.random() * 0.22;
    d = 1.1 + Math.random() * 0.28;
  } else {
    w = 0.82 + Math.random() * 0.3;
    h = 0.55 + Math.random() * 0.28;
    d = 0.82 + Math.random() * 0.3;
  }
  return {
    lane: LANES[laneIdx],
    z,
    speed: LANE_SPEED[laneIdx],
    w,
    h,
    d,
    yaw: (Math.random() - 0.5) * 0.1,
    shade: 0.86 + Math.random() * 0.14,
    phase: Math.random() * Math.PI * 2,
  };
}

export function Packages({ mobile }: { mobile: boolean }) {
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const labelRef = useRef<THREE.InstancedMesh>(null);
  const tapeRef = useRef<THREE.InstancedMesh>(null);
  const shadowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const geom = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 3, 0.045), []);

  const { map, normalMap, roughnessMap } = useBoxTextures();
  const labelTex = useLabelTexture();
  const tapeTex = useTapeTexture();
  const shadowTex = useContactShadowTexture();

  // Materiais criados à mão: só os mapas de COR vão para sRGB (normal e
  // roughness são dados lineares — converter distorce o relevo).
  const mats = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    labelTex.colorSpace = THREE.SRGBColorSpace;
    tapeTex.colorSpace = THREE.SRGBColorSpace;
    return {
      box: new THREE.MeshStandardMaterial({
        map,
        normalMap,
        normalScale: new THREE.Vector2(1.2, 1.2),
        roughnessMap,
        roughness: 0.92,
        metalness: 0,
        envMapIntensity: 0.55,
      }),
      label: new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.7, metalness: 0, envMapIntensity: 0.5 }),
      // Verniz (clearcoat) só no desktop: no celular é um passe de luz a mais por pixel.
      tape: mobile
        ? new THREE.MeshStandardMaterial({ map: tapeTex, roughness: 0.34, metalness: 0, envMapIntensity: 0.8 })
        : new THREE.MeshPhysicalMaterial({
            map: tapeTex,
            roughness: 0.38,
            metalness: 0,
            clearcoat: 0.6,
            clearcoatRoughness: 0.25,
            envMapIntensity: 0.8,
          }),
      shadow: new THREE.MeshBasicMaterial({
        map: shadowTex,
        color: '#000000',
        transparent: true,
        opacity: mobile ? 0.8 : 0.55,
        depthWrite: false,
      }),
    };
  }, [map, normalMap, roughnessMap, labelTex, tapeTex, shadowTex, mobile]);

  const perLane = mobile ? 6 : 10;
  const count = LANES.length * perLane;

  const pkgs = useMemo<Pkg[]>(() => {
    const list: Pkg[] = [];
    for (let li = 0; li < LANES.length; li++) {
      for (let k = 0; k < perLane; k++) {
        list.push(makePkg(li, Z_FAR + (LEN / perLane) * k + Math.random() * 0.8));
      }
    }
    return list;
  }, [perLane]);

  useFrame((state, delta) => {
    const box = boxRef.current;
    const label = labelRef.current;
    const tape = tapeRef.current;
    const shadow = shadowRef.current;
    if (!box || !label || !tape || !shadow) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pkgs.length; i++) {
      const p = pkgs[i];
      p.z += p.speed * dt;
      if (p.z > Z_NEAR) p.z = Z_FAR + (p.z - Z_NEAR);

      // Trepidação: a caixa "pula" de leve a cada rolete e balança um tico.
      const bump = Math.abs(Math.sin(p.z * 13.1 + p.phase)) * 0.006;
      const rock = Math.sin(t * 9 + p.phase) * 0.004;
      const cy = p.h / 2 + 0.004 + bump;
      dummy.position.set(p.lane, cy, p.z);
      dummy.rotation.set(rock, p.yaw, rock * 0.6);
      dummy.scale.set(p.w, p.h, p.d);
      dummy.updateMatrix();
      box.setMatrixAt(i, dummy.matrix);
      color.setScalar(p.shade);
      box.setColorAt(i, color);

      // Etiqueta na face frontal.
      const sin = Math.sin(p.yaw);
      const cos = Math.cos(p.yaw);
      const off = p.d / 2 + 0.011;
      dummy.position.set(p.lane + sin * off, cy + p.h * 0.04, p.z + cos * off);
      dummy.rotation.set(rock, p.yaw, rock * 0.6);
      dummy.scale.set(Math.min(p.w * 0.66, 0.56), Math.min(p.h * 0.58, 0.4), 1);
      dummy.updateMatrix();
      label.setMatrixAt(i, dummy.matrix);

      // Fita como cinta (topo + laterais), levemente proeminente.
      dummy.position.set(p.lane, cy, p.z);
      dummy.rotation.set(rock, p.yaw, rock * 0.6);
      dummy.scale.set(p.w + 0.016, p.h + 0.016, Math.min(p.d * 0.32, 0.5));
      dummy.updateMatrix();
      tape.setMatrixAt(i, dummy.matrix);

      // Sombra de contato no plano dos roletes.
      dummy.position.set(p.lane, 0.006, p.z + 0.06);
      dummy.rotation.set(-Math.PI / 2, 0, -p.yaw);
      dummy.scale.set(p.w * 1.5, p.d * 1.55, 1);
      dummy.updateMatrix();
      shadow.setMatrixAt(i, dummy.matrix);
    }
    box.instanceMatrix.needsUpdate = true;
    label.instanceMatrix.needsUpdate = true;
    tape.instanceMatrix.needsUpdate = true;
    shadow.instanceMatrix.needsUpdate = true;
    if (box.instanceColor) box.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={shadowRef} args={[undefined, mats.shadow, count]} frustumCulled={false} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
      <instancedMesh ref={boxRef} args={[geom, mats.box, count]} castShadow={!mobile} receiveShadow frustumCulled={false} />
      <instancedMesh ref={labelRef} args={[undefined, mats.label, count]} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
      <instancedMesh ref={tapeRef} args={[undefined, mats.tape, count]} castShadow={!mobile} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </>
  );
}
