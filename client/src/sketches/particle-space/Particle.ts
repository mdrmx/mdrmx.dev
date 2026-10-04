import type p5 from "p5";

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

  // else-if avoids wrapping to the far side and immediately re-triggering.
  edges() {
    const { width, height } = this.p;
    if (this.pos.x >= width) this.pos.x = 0;
    else if (this.pos.x <= 0) this.pos.x = width;

    if (this.pos.y >= height) this.pos.y = 0;
    else if (this.pos.y <= 0) this.pos.y = height;
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
