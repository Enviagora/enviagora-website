import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/* ==========================================================================
   MeshField — hero variante "Malha viva".
   Rede de nós/rotas em canvas 2D com pacotes viajando (rastro de luz),
   hub central luminoso, profundidade e parallax no mouse. Leve e mobile-safe.
   ========================================================================== */

const PETROLEO = '18,51,54';
const NEON = '196,255,87';
const CREME = '250,250,245';

type Node = { bx: number; by: number; depth: number; x: number; y: number; hub?: boolean; pulse: number };
type Edge = { a: number; b: number };
type Packet = { edge: number; t: number; speed: number; dir: 1 | -1 };

export function MeshField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const g2d = el.getContext('2d');
    if (!g2d) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let packets: Packet[] = [];
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    function build() {
      const N = w < 640 ? 24 : 44;
      nodes = [];
      for (let i = 0; i < N; i++) {
        nodes.push({ bx: Math.random(), by: Math.random(), depth: 0.35 + Math.random() * 0.65, x: 0, y: 0, pulse: Math.random() * Math.PI * 2 });
      }
      nodes.push({ bx: 0.52, by: 0.44, depth: 1, x: 0, y: 0, hub: true, pulse: 0 });
      const hub = nodes.length - 1;

      edges = [];
      const seen = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        if (i === hub) continue;
        const near = nodes
          .map((n, j) => ({ j, dist: (n.bx - nodes[i].bx) ** 2 + (n.by - nodes[i].by) ** 2 }))
          .filter((o) => o.j !== i)
          .sort((a, b) => a.dist - b.dist);
        const links = [near[0].j, near[1].j];
        if (i % 3 === 0) links.push(hub);
        for (const j of links) {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            edges.push({ a: i, b: j });
          }
        }
      }

      const P = w < 640 ? 10 : 18;
      packets = Array.from({ length: P }, () => ({
        edge: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.12 + Math.random() * 0.22,
        dir: Math.random() > 0.5 ? 1 : -1,
      }));
    }

    function resize() {
      w = el!.clientWidth;
      h = el!.clientHeight;
      el!.width = Math.max(1, Math.floor(w * dpr));
      el!.height = Math.max(1, Math.floor(h * dpr));
      g2d!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function project() {
      const ox = (pointer.x - 0.5) * 60;
      const oy = (pointer.y - 0.5) * 40;
      for (const n of nodes) {
        n.x = n.bx * w + ox * n.depth;
        n.y = n.by * h + oy * n.depth;
      }
    }

    function draw(dt: number, animate: boolean) {
      const ctx = g2d!;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      project();

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgb(${PETROLEO})`;
      ctx.fillRect(0, 0, w, h);
      const hub = nodes[nodes.length - 1];
      const grad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, Math.max(w, h) * 0.5);
      grad.addColorStop(0, `rgba(${NEON},0.10)`);
      grad.addColorStop(1, `rgba(${NEON},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.strokeStyle = `rgba(${CREME},${0.05 + Math.min(a.depth, b.depth) * 0.06})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const p of packets) {
        if (animate) {
          p.t += p.speed * dt * p.dir;
          if (p.t > 1) {
            p.t = 0;
            p.edge = Math.floor(Math.random() * edges.length);
          } else if (p.t < 0) {
            p.t = 1;
            p.edge = Math.floor(Math.random() * edges.length);
          }
        }
        const e = edges[p.edge];
        if (!e) continue;
        const a = nodes[e.a];
        const b = nodes[e.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const tailT = Math.max(0, Math.min(1, p.t - 0.16 * p.dir));
        const tx = a.x + (b.x - a.x) * tailT;
        const ty = a.y + (b.y - a.y) * tailT;
        const tg = ctx.createLinearGradient(tx, ty, x, y);
        tg.addColorStop(0, `rgba(${NEON},0)`);
        tg.addColorStop(1, `rgba(${NEON},0.9)`);
        ctx.strokeStyle = tg;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${NEON},1)`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const n of nodes) {
        if (n.hub) {
          n.pulse += animate ? dt * 2 : 0;
          const r = 6 + Math.sin(n.pulse) * 1.5;
          ctx.fillStyle = `rgba(${NEON},0.18)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgb(${NEON})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${CREME},${0.25 + n.depth * 0.35})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.2 + n.depth * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    let last = 0;
    function loop(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      draw(dt, true);
      raf = requestAnimationFrame(loop);
    }

    function onMove(ev: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      pointer.tx = (ev.clientX - rect.left) / rect.width;
      pointer.ty = (ev.clientY - rect.top) / rect.height;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);

    if (reduce) {
      draw(0, false);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduce]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
