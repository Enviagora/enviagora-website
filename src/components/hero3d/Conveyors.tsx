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

  const pitch = mobile ? 0.32 : 0.24; // distância entre roletes
  const perLane = Math.floor(LEN / pitch);
  const LEG_STEP = 3;
  const legsPerLane = Math.floor(LEN / LEG_STEP) + 1;
  const LEG_H = -FLOOR_Y - 0.12;

  useLayoutEffect(() => {
    const rollers = rollerRef.current;
    const legs = legRef.current;
    const cross = crossRef.current;
    if (!rollers || !legs || !cross) return;
    let r = 0;
    let l = 0;
    let c = 0;
    for (const x of LANES) {
      for (let k = 0; k < perLane; k++) {
        tmp.position.set(x, -ROLLER_R, Z_FAR + k * pitch + pitch / 2);
        tmp.rotation.set(0, 0, Math.PI / 2);
        tmp.scale.set(1, 1, 1);
        tmp.updateMatrix();
        rollers.setMatrixAt(r++, tmp.matrix);
      }
      for (let k = 0; k < legsPerLane; k++) {
        const z = Z_FAR + k * LEG_STEP + 0.4;
        for (const s of [-1, 1]) {
          tmp.position.set(x + s * (BELT_W / 2 - 0.02), FLOOR_Y + LEG_H / 2, z);
          tmp.rotation.set(0, 0, 0);
          tmp.scale.set(0.07, LEG_H, 0.07);
          tmp.updateMatrix();
          legs.setMatrixAt(l++, tmp.matrix);
        }
        tmp.position.set(x, FLOOR_Y + 0.32, z);
        tmp.scale.set(BELT_W - 0.05, 0.05, 0.05);
        tmp.updateMatrix();
        cross.setMatrixAt(c++, tmp.matrix);
      }
    }
    for (const m of [rollers, legs, cross]) {
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

      {LANES.map((x, i) => (
        <group key={x} position={[x, 0, Z_MID]}>
          {[-1, 1].map((s) => (
            <group key={s}>
              {/* perfil lateral (C) */}
              <mesh material={mats.frame} position={[s * (BELT_W / 2 + 0.04), -0.07, 0]} castShadow={!mobile} receiveShadow>
                <boxGeometry args={[0.07, 0.2, LEN]} />
              </mesh>
              {/* guia lateral (tubo) */}
              <mesh material={mats.guide} position={[s * (BELT_W / 2 + 0.02), 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.022, 0.022, LEN, 10]} />
              </mesh>
              {i === ACCENT_LANE && (
                <mesh material={mats.led} position={[s * (BELT_W / 2 + 0.078), -0.05, 0]}>
                  <boxGeometry args={[0.012, 0.03, LEN]} />
                </mesh>
              )}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
