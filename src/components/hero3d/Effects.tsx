import { Bloom, DepthOfField, EffectComposer, N8AO, Noise, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';

/**
 * Pós-processamento do hero (só desktop) — o "acabamento de câmera":
 * - N8AO: oclusão ambiente (cantos e contato entre caixa, rolete e chão)
 * - Bloom: só o que passa de 1.0 (lâmpadas e LED neon) ganha brilho
 * - Profundidade de campo: frente nítida, fundo do galpão desfocado
 * - Tone mapping AgX (o composer desliga o do renderer)
 * - Vinheta + grão de filme sutil (já em faixa 0–1)
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={0.9} distanceFalloff={0.6} intensity={2.4} quality="medium" halfRes />
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.15} intensity={0.6} radius={0.7} />
      <DepthOfField worldFocusDistance={9} worldFocusRange={11} bokehScale={2.4} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      {/* Depois do tone mapping: em HDR (> 1) o soft-light do grão gera pontos pretos/azuis */}
      <Vignette offset={0.28} darkness={0.5} />
      <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.22} />
      <SMAA />
    </EffectComposer>
  );
}
