import p5 from "p5";
import type { P5SketchFactory } from "../../components/P5Sketch";
import {
  DEFAULT_PARAMS,
  PALETTE_HEX,
  PARTICLE_SIZE,
  TRAIL_ALPHA,
  type ParticleSpaceParams,
} from "./config";
import { Particle } from "./Particle";

/** Floating particles joined by lines (and filled triangles) based on proximity. */
export function createParticleSpace() {
  const state = {
    params: { ...DEFAULT_PARAMS },
    paused: false,
    eraseBackground: true,
  };

  const sketch: P5SketchFactory = (p, host) => {
    const particles: Particle[] = [];
    const vectors: p5.Vector[] = [];
    let palette: p5.Color[] = [];
    let cols = 0;
    let rows = 0;
    let zoff = 0;
    let drift = 0;

    const hostSize = () => ({
      width: Math.max(1, host.clientWidth),
      height: Math.max(1, host.clientHeight),
    });
    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = hostSize();
      p.resizeCanvas(width, height);
    });

    // Opaque normally; near-transparent when trails are on.
    const currentAlpha = () => (state.eraseBackground ? 255 : TRAIL_ALPHA);

    // Shortest displacement from a to b on a wrapping canvas.
    const wrapDelta = (a: p5.Vector, b: p5.Vector) => {
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      if (Math.abs(dx) > p.width / 2) dx += dx > 0 ? -p.width : p.width;
      if (Math.abs(dy) > p.height / 2) dy += dy > 0 ? -p.height : p.height;
      return { dx, dy };
    };

    const rebuildField = () => {
      cols = Math.floor(p.width / state.params.cellSize);
      rows = Math.floor(p.height / state.params.cellSize);
      vectors.length = cols * rows;
    };

    const setParticleCount = (target: number) => {
      while (particles.length < target) {
        particles.push(new Particle(p, PARTICLE_SIZE, p.color(0)));
      }
      if (particles.length > target) particles.length = target;
    };

    const updateFlowField = () => {
      const { noiseDetail, turns, evolveSpeed, driftSpeed } = state.params;
      rebuildField();
      let xoff = drift;
      for (let x = 0; x < cols; x++) {
        let yoff = 0;
        for (let y = 0; y < rows; y++) {
          const angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * turns;
          vectors[x + y * cols] = p5.Vector.fromAngle(angle);
          yoff += noiseDetail;
        }
        xoff += noiseDetail;
      }
      zoff += evolveSpeed;
      drift += driftSpeed;
    };

    // Grid-based, softened, wrap-aware repulsion to reduce overlap.
    const applyRepulsion = () => {
      const radius = state.params.repelRadius;
      const maxRepel = state.params.repelStrength;
      if (maxRepel <= 0) return;

      const gridCols = Math.ceil(p.width / radius);
      const gridRows = Math.ceil(p.height / radius);
      const cellOf = (particle: Particle): [number, number] => [
        ((Math.floor(particle.pos.x / radius) % gridCols) + gridCols) %
          gridCols,
        ((Math.floor(particle.pos.y / radius) % gridRows) + gridRows) %
          gridRows,
      ];

      const grid: number[][] = Array.from(
        { length: gridCols * gridRows },
        () => [],
      );
      particles.forEach((particle, i) => {
        const [cx, cy] = cellOf(particle);
        grid[cx + cy * gridCols].push(i);
      });

      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        const [cx, cy] = cellOf(pi);
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const bucket =
              grid[
                ((cx + ox + gridCols) % gridCols) +
                  ((cy + oy + gridRows) % gridRows) * gridCols
              ];
            for (const j of bucket) {
              if (j <= i) continue;
              const pj = particles[j];
              const { dx, dy } = wrapDelta(pi.pos, pj.pos);
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d >= radius) continue;

              let nx: number;
              let ny: number;
              if (d < 0.001) {
                const angle = p.random(p.TWO_PI);
                nx = Math.cos(angle);
                ny = Math.sin(angle);
              } else {
                nx = dx / d;
                ny = dy / d;
              }
              const t = 1 - d / radius;
              const strength = maxRepel * t * t;
              pi.applyForce(p.createVector(-nx * strength, -ny * strength));
              pj.applyForce(p.createVector(nx * strength, ny * strength));
            }
          }
        }
      }
    };

    const computeEdges = () => {
      const n = particles.length;
      const connections = new Array<number>(n).fill(0);
      const adjacency = Array.from({ length: n }, () => new Set<number>());
      const edges: [number, number][] = [];
      const maxConn = Math.floor(state.params.maxConn);

      for (let i = 0; i < n; i++) {
        if (connections[i] >= maxConn) continue;
        for (let j = i + 1; j < n; j++) {
          if (connections[i] >= maxConn) break;
          if (connections[j] >= maxConn) continue;
          const { dx, dy } = wrapDelta(particles[i].pos, particles[j].pos);
          if (Math.sqrt(dx * dx + dy * dy) < state.params.lineDist) {
            adjacency[i].add(j);
            adjacency[j].add(i);
            connections[i]++;
            connections[j]++;
            edges.push([i, j]);
          }
        }
      }
      return { edges, adjacency };
    };

    const drawTriangles = (adjacency: Set<number>[]) => {
      p.noStroke();
      for (let i = 0; i < particles.length; i++) {
        const neighbours = Array.from(adjacency[i]).sort((a, b) => a - b);
        for (let a = 0; a < neighbours.length; a++) {
          for (let b = a + 1; b < neighbours.length; b++) {
            const j = neighbours[a];
            const k = neighbours[b];
            if (!(i < j && j < k && adjacency[j].has(k))) continue;
            const origin = particles[i].pos;
            const d2 = wrapDelta(origin, particles[j].pos);
            const d3 = wrapDelta(origin, particles[k].pos);
            const fill = p.color(palette[(i + j + k) % palette.length]);
            fill.setAlpha(currentAlpha());
            p.fill(fill);
            p.triangle(
              origin.x,
              origin.y,
              origin.x + d2.dx,
              origin.y + d2.dy,
              origin.x + d3.dx,
              origin.y + d3.dy,
            );
          }
        }
      }
    };

    const drawEdges = (edges: [number, number][]) => {
      p.stroke(0, currentAlpha());
      p.strokeWeight(1);
      for (const [i, j] of edges) {
        const origin = particles[i].pos;
        const { dx, dy } = wrapDelta(origin, particles[j].pos);
        p.line(origin.x, origin.y, origin.x + dx, origin.y + dy);
      }
    };

    p.setup = () => {
      const { width, height } = hostSize();
      p.pixelDensity(2);
      p.createCanvas(width, height).parent(host);
      palette = PALETTE_HEX.map((hex) => p.color(hex));
      rebuildField();
      resizeObserver.observe(host);
    };

    p.draw = () => {
      if (state.eraseBackground) p.background(255);

      setParticleCount(state.params.count);

      if (!state.paused) {
        updateFlowField();
        applyRepulsion();
        for (const particle of particles) {
          particle.follow(
            vectors,
            state.params.cellSize,
            cols,
            rows,
            state.params.flowStrength,
          );
          particle.update(state.params.maxSpeed);
          particle.edges();
        }
      }

      const { edges, adjacency } = computeEdges();
      if (state.params.showFills) drawTriangles(adjacency);
      if (state.params.showLines) drawEdges(edges);
      if (state.params.showNodes) {
        for (const particle of particles) particle.show(currentAlpha());
      }
    };

    return () => resizeObserver.disconnect();
  };

  return {
    sketch,
    setParam<K extends keyof ParticleSpaceParams>(
      key: K,
      value: ParticleSpaceParams[K],
    ) {
      state.params[key] = value;
    },
    setPaused(paused: boolean) {
      state.paused = paused;
    },
    setEraseBackground(erase: boolean) {
      state.eraseBackground = erase;
    },
    reset() {
      state.params = { ...DEFAULT_PARAMS };
    },
  };
}
