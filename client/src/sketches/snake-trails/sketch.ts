import p5 from "p5";
import type { P5SketchFactory } from "../../components/P5Sketch";

export type SnakeTrailsParams = {
  cellSize: number;
  areaScale: number;
  fadeSpeed: number;
  trailLength: number;
  spriteCount: number;
  updateInterval: number;
};

export const DEFAULT_SNAKE_TRAILS_PARAMS: SnakeTrailsParams = {
  cellSize: 20,
  areaScale: 0.67,
  fadeSpeed: 10,
  trailLength: 25,
  spriteCount: 20,
  updateInterval: 100,
};

type TrailSegment = {
  column: number;
  row: number;
  alpha: number;
};

type Sprite = {
  column: number;
  row: number;
  colour: p5.Color;
  trail: TrailSegment[];
};

export function createSnakeTrails() {
  const state = {
    params: { ...DEFAULT_SNAKE_TRAILS_PARAMS },
    paused: false,
    reset: () => {},
    setParam: <K extends keyof SnakeTrailsParams>(
      key: K,
      value: SnakeTrailsParams[K],
    ) => {
      state.params[key] = value;
      if (
        key === "cellSize" ||
        key === "areaScale" ||
        key === "spriteCount"
      ) {
        state.reset();
      }
      if (key === "trailLength") {
        for (const sprite of sprites) {
          while (sprite.trail.length > state.params.trailLength) {
            const removed = sprite.trail.shift();
            if (removed) setOccupied(removed.column, removed.row, false);
          }
        }
      }
      if (key === "updateInterval") startTimer();
      p?.redraw();
    },
    setPaused: (paused: boolean) => {
      state.paused = paused;
    },
  };

  let p: p5 | undefined;
  let timer: number | undefined;
  let hasCanvas = false;
  let canvasWidth = 1;
  let canvasHeight = 1;
  let cellSize = DEFAULT_SNAKE_TRAILS_PARAMS.cellSize;
  let columns = 1;
  let rows = 1;
  let areaX = 0;
  let areaY = 0;
  let occupied = new Uint8Array(1);
  let sprites: Sprite[] = [];

  const cellIndex = (column: number, row: number) => column + row * columns;

  const setOccupied = (column: number, row: number, value: boolean) => {
    occupied[cellIndex(column, row)] = value ? 1 : 0;
  };

  const initialize = () => {
    if (!p) return;

    const areaSize = Math.min(canvasWidth, canvasHeight) * state.params.areaScale;
    cellSize = state.params.cellSize;
    columns = Math.max(1, Math.floor(areaSize / cellSize));
    rows = columns;
    const actualAreaSize = columns * cellSize;
    areaX = Math.floor((canvasWidth - actualAreaSize) / 2);
    areaY = Math.floor((canvasHeight - actualAreaSize) / 2);
    occupied = new Uint8Array(columns * rows);
    sprites = [];

    const positions = Array.from({ length: columns * rows }, (_, index) => index);
    for (let index = positions.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(p.random(index + 1));
      [positions[index], positions[swapIndex]] = [
        positions[swapIndex],
        positions[index],
      ];
    }

    const palette = [
      p.color(0, 0, 0),
      p.color(255, 255, 255),
      p.color(96, 106, 245),
    ];
    const count = Math.min(state.params.spriteCount, positions.length);
    for (let index = 0; index < count; index++) {
      const position = positions[index];
      if (position === undefined) continue;
      const column = position % columns;
      const row = Math.floor(position / columns);
      setOccupied(column, row, true);
      const colour = palette[Math.floor(p.random(palette.length))];
      if (colour) sprites.push({ column, row, colour, trail: [] });
    }
  };

  const updateSprites = () => {
    if (!p || state.paused) return;

    const directions = [
      { column: 1, row: 0 },
      { column: 0, row: -1 },
      { column: 0, row: 1 },
      { column: -1, row: 0 },
    ];

    for (const sprite of sprites) {
      const available = directions
        .map(({ column, row }) => ({
          column: (sprite.column + column + columns) % columns,
          row: (sprite.row + row + rows) % rows,
        }))
        .filter(({ column, row }) => occupied[cellIndex(column, row)] === 0);

      if (available.length > 0) {
        const next = available[Math.floor(p.random(available.length))];
        if (next) {
          sprite.trail.push({
            column: sprite.column,
            row: sprite.row,
            alpha: 255,
          });
          sprite.column = next.column;
          sprite.row = next.row;
          setOccupied(next.column, next.row, true);
        }
      }

      while (sprite.trail.length > state.params.trailLength) {
        const removed = sprite.trail.shift();
        if (removed) setOccupied(removed.column, removed.row, false);
      }

      for (let index = sprite.trail.length - 1; index >= 0; index--) {
        const segment = sprite.trail[index];
        if (!segment) continue;
        segment.alpha = Math.max(0, segment.alpha - state.params.fadeSpeed);
        if (segment.alpha === 0) {
          setOccupied(segment.column, segment.row, false);
          sprite.trail.splice(index, 1);
        }
      }
    }
  };

  const startTimer = () => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = window.setInterval(() => {
      updateSprites();
      p?.redraw();
    }, state.params.updateInterval);
  };

  const sketch: P5SketchFactory = (instance, host) => {
    p = instance;
    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      if (width === canvasWidth && height === canvasHeight) return;
      canvasWidth = width;
      canvasHeight = height;
      if (hasCanvas) {
        p?.resizeCanvas(width, height);
        initialize();
        p?.redraw();
      }
    });

    p.setup = () => {
      canvasWidth = Math.max(1, host.clientWidth);
      canvasHeight = Math.max(1, host.clientHeight);
      p?.createCanvas(canvasWidth, canvasHeight);
      hasCanvas = true;
      p?.noLoop();
      initialize();
      resizeObserver.observe(host);
      startTimer();
    };

    p.draw = () => {
      if (!p) return;
      p.background(45);
      for (const sprite of sprites) {
        for (const segment of sprite.trail) {
          p.fill(
            p.red(sprite.colour),
            p.green(sprite.colour),
            p.blue(sprite.colour),
            segment.alpha,
          );
          p.noStroke();
          p.rect(
            areaX + segment.column * cellSize,
            areaY + segment.row * cellSize,
            cellSize,
            cellSize,
          );
        }
        p.fill(sprite.colour);
        p.noStroke();
        p.rect(
          areaX + sprite.column * cellSize,
          areaY + sprite.row * cellSize,
          cellSize,
          cellSize,
        );
      }
      const borderThickness = Math.max(2, Math.min(4, Math.floor(cellSize / 10)));
      p.noFill();
      p.stroke(5);
      p.strokeWeight(borderThickness);
      p.rect(
        areaX - borderThickness / 2,
        areaY - borderThickness / 2,
        columns * cellSize + borderThickness,
        rows * cellSize + borderThickness,
      );
    };

    state.reset = () => {
      initialize();
      p?.redraw();
    };
    return () => {
      resizeObserver.disconnect();
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
      hasCanvas = false;
      p = undefined;
    };
  };

  return { sketch, ...state };
}
