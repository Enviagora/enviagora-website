import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ACCENT_LANE, BELT_W, FLOOR_Y, LANES, LEN, NEON, ROLLER_R, Z_FAR, Z_MID } from './layout';

/* ==========================================================================
   Transportadores de roletes: roletes galvanizados (instanciados), perfis
   laterais pintados, guias, pés com travessa e, numa das linhas, uma fita de
   LED neon (o toque da marca).
   ========================================================================== */

const tmp = new THREE.Object3D();

export function Conveyors({ mobile }: { mobile: boolean }) {
  const rollerRef = useRef<THREE.InstancedMesh>(null);
  const legRef = useRef<THREE.InstancedMesh>(null);
  const crossRef = useRef<THREE.InstancedMesh>(null);
  const frameRef = useRef<THREE.InstancedMesh>(null);
  const guideRef = useRef<THREE.InstancedMesh>(null);
  const ledRef = useRef<THREE.InstancedMesh>(null);

  const pitch = mobile ? 0.32 : 0.24; // distância entre roletes
  const perLane = Math.floor(LEN / pitch);
  const LEG_STEP = 3;
  const legsPerLane = Math.floor(LEN / LEG_STEP) + 1;
  const LEG_H = -FLOOR_Y - 0.12;

  // Tudo instanciado: peças com o mesmo material compartilham o mesmo programa
  // de shader (menos compilação ao abrir a página, sobretudo no iPhone).
  useLayoutEffect(() => {
    const rollers = rollerRef.current;
    const legs = legRef.current;
    const cross = crossRef.current;
    const frames = frameRef.current;
    const guides = guideRef.current;
    const leds = ledRef.current;
    if (!rollers || !legs || !cross || !frames || !guides || !leds) return;
    let r = 0;
    let l = 0;
    let c = 0;
    let f = 0;
    let g = 0;
    let e = 0;
    const put = (m: THREE.InstancedMesh, i: number, px: number, py: number, pz: number, sx: number, sy: number, sz: number, rx = 0, rz = 0) => {
      tmp.position.set(px, py, pz);
      tmp.rotation.set(rx, 0, rz);
      tmp.scale.set(sx, sy, sz);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    };
    LANES.forEach((x, li) => {
      for (let k = 0; k < perLane; k++) put(rollers, r++, x, -ROLLER_R, Z_FAR + k * pitch + pitch / 2, 1, 1, 1, 0, Math.PI / 2);
      for (let k = 0; k < legsPerLane; k++) {
        const z = Z_FAR + k * LEG_STEP + 0.4;
        for (const s of [-1, 1]) put(legs, l++, x + s * (BELT_W / 2 - 0.02), FLOOR_Y + LEG_H / 2, z, 0.07, LEG_H, 0.07);
        put(cross, c++, x, FLOOR_Y + 0.32, z, BELT_W - 0.05, 0.05, 0.05);
      }
      for (const s of [-1, 1]) {
        put(frames, f++, x + s * (BELT_W / 2 + 0.04), -0.07, Z_MID, 0.07, 0.2, LEN); // perfil lateral (C)
        put(guides, g++, x + s * (BELT_W / 2 + 0.02), 0.13, Z_MID, 1, LEN, 1, Math.PI / 2); // guia (tubo)
        if (li === ACCENT_LANE) put(leds, e++, x + s * (BELT_W / 2 + 0.078), -0.05, Z_MID, 0.012, 0.03, LEN);
      }
    });
    for (const m of [rollers, legs, cross, frames, guides, leds]) {
      m.instanceMatrix.needsUpdate = true;
      m.computeBoundingSphere();
    }
  }, [perLane, legsPerLane, pitch, LEG_H]);

  const mats = useMemo(
    () => ({
      // aço galvanizado: claro, metálico e um pouco escovado
      roller: new THREE.MeshStandardMaterial({ color: '#b9c2c4', metalness: 0.92, roughness: 0.3, envMapIntensity: 1.1 }),
      frame: new THREE.MeshStandardMaterial({ color: '#33464a', metalness: 0.55, roughness: 0.42 }),
      guide: new THREE.MeshStandardMaterial({ color: '#c9d0d2', metalness: 0.9, roughness: 0.25 }),
      leg: new THREE.MeshStandardMaterial({ color: '#2c3c3f', metalness: 0.5, roughness: 0.5 }),
      led: new THREE.MeshBasicMaterial({ color: new THREE.Color(NEON).multiplyScalar(2.2), toneMapped: false }),
    }),
    [],
  );

  return (
    <group>
      <instancedMesh ref={rollerRef} args={[undefined, mats.roller, LANES.length * perLane]} receiveShadow castShadow={!mobile}>
        <cylinderGeometry args={[ROLLER_R, ROLLER_R, BELT_W - 0.04, mobile ? 10 : 16]} />
      </instancedMesh>
      <instancedMesh ref={legRef} args={[undefined, mats.leg, LANES.length * legsPerLane * 2]} castShadow={!mobile}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={crossRef} args={[undefined, mats.leg, LANES.length * legsPerLane]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={frameRef} args={[undefined, mats.frame, LANES.length * 2]} castShadow={!mobile} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={guideRef} args={[undefined, mats.guide, LANES.length * 2]}>
        <cylinderGeometry args={[0.022, 0.022, 1, 10]} />
      </instancedMesh>
      <instancedMesh ref={ledRef} args={[undefined, mats.led, 2]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </group>
  );
}
