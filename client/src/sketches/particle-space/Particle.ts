import type p5 from "p5";

// Repulsion at a wall must outweigh the strongest flow-field force (0.6).
const EDGE_MARGIN = 50;
const EDGE_STRENGTH = 3;

export class Particle {
  p: p5;
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  size: number;
  colour: p5.Color;

  constructor(p: p5, size: number, colour: p5.Color) {
    this.p = p;
    this.pos = p.createVector(p.random(0, p.width), p.random(p.height));
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(p.random(-1, 1), p.random(-1, 1));
    this.size = size;
    this.colour = colour;
  }

  follow(
    vectors: p5.Vector[],
    cellSize: number,
    cols: number,
    rows: number,
    strength: number,
  ) {
    const { p } = this;
    const x = p.constrain(Math.floor(this.pos.x / cellSize), 0, cols - 1);
    const y = p.constrain(Math.floor(this.pos.y / cellSize), 0, rows - 1);
    const force = vectors[x + y * cols];
    if (force) {
      // Copy so the shared flow-field vector isn't mutated.
      this.applyForce(force.copy().mult(strength));
    }
  }

  applyForce(force: p5.Vector) {
    this.acc.add(force);
  }

  update(maxSpeed: number) {
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  // Each wall pushes inward within `margin`, ramping up quadratically toward the edge.
  edges(margin = EDGE_MARGIN, strength = EDGE_STRENGTH) {
    const { width, height } = this.p;
    const push = (distance: number) => {
      const t = Math.max(0, 1 - distance / margin);
      return strength * t * t;
    };

    this.applyForce(
      this.p.createVector(
        push(this.pos.x) - push(width - this.pos.x),
        push(this.pos.y) - push(height - this.pos.y),
      ),
    );

    // Safety net so a fast particle can never leave the canvas.
    if (this.pos.x < 0 || this.pos.x > width) {
      this.pos.x = this.p.constrain(this.pos.x, 0, width);
      this.vel.x = 0;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.pos.y = this.p.constrain(this.pos.y, 0, height);
      this.vel.y = 0;
    }
  }

  show(alpha = 255) {
    const { p } = this;
    const c = p.color(this.colour);
    c.setAlpha(alpha);
    p.stroke(c);
    p.strokeWeight(this.size);
    p.point(this.pos.x, this.pos.y);
  }
}
