import { useState } from "react";
import { P5Sketch } from "../../components/P5Sketch";
import {
  DEFAULT_SNAKE_TRAILS_PARAMS,
  createSnakeTrails,
  type SnakeTrailsParams,
} from "./sketch";
import "./SnakeTrails.css";

const CONTROLS: {
  key: keyof SnakeTrailsParams;
  label: string;
  min: number;
  max: number;
  step: number;
  format?: (value: number) => string;
}[] = [
  { key: "cellSize", label: "Grid size", min: 8, max: 40, step: 1 },
  {
    key: "areaScale",
    label: "Area size",
    min: 0.3,
    max: 0.9,
    step: 0.01,
    format: (value) => `${Math.round(value * 100)}%`,
  },
  { key: "fadeSpeed", label: "Fade speed", min: 1, max: 64, step: 1 },
  { key: "trailLength", label: "Trail segments", min: 5, max: 100, step: 1 },
  { key: "spriteCount", label: "Number of sprites", min: 1, max: 200, step: 1 },
  {
    key: "updateInterval",
    label: "Speed",
    min: 50,
    max: 500,
    step: 1,
    format: (value) => `${value} ms`,
  },
];

export function SnakeTrails() {
  const [controller] = useState(createSnakeTrails);
  const [params, setParams] = useState(DEFAULT_SNAKE_TRAILS_PARAMS);
  const [paused, setPaused] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const changeParam = <K extends keyof SnakeTrailsParams>(
    key: K,
    value: SnakeTrailsParams[K],
  ) => {
    controller.setParam(key, value);
    setParams((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    controller.reset();
  };

  const togglePause = () => {
    const nextPaused = !paused;
    controller.setPaused(nextPaused);
    setPaused(nextPaused);
  };

  return (
    <div className="snake-trails">
      <P5Sketch sketch={controller.sketch} className="snake-trails__canvas" />
      <button
        type="button"
        className="snake-trails__toggle"
        aria-expanded={controlsOpen}
        onClick={() => setControlsOpen((open) => !open)}
      >
        {controlsOpen ? "Hide controls" : "Show controls"}
      </button>
      {controlsOpen && (
        <div className="snake-trails__panel">
          <div className="snake-trails__actions">
            <button type="button" onClick={togglePause}>
              {paused ? "Resume" : "Pause"}
            </button>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </div>
          {CONTROLS.map(({ key, label, min, max, step, format }) => (
            <label className="snake-trails__control" key={key}>
              <span>{label}</span>
              <output>
                {format?.(params[key]) ?? params[key]}
              </output>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={(event) =>
                  changeParam(key, Number(event.currentTarget.value))
                }
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
