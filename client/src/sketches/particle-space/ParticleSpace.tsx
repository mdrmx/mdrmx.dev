import { useEffect, useState, type ChangeEvent } from "react";
import { P5Sketch } from "../../components/P5Sketch";
import {
  DEFAULT_PARAMS,
  UI_SECTIONS,
  type Control,
  type ParticleSpaceParams,
  type SliderControl,
} from "./config";
import { createParticleSpace } from "./sketch";
import "./ParticleSpace.css";

const formatValue = (control: SliderControl, value: number) =>
  control.decimals ? value.toFixed(control.decimals) : String(value);

export function ParticleSpace() {
  const [controller] = useState(createParticleSpace);
  const [params, setParams] = useState<ParticleSpaceParams>(DEFAULT_PARAMS);
  const [paused, setPaused] = useState(false);
  const [eraseBackground, setEraseBackground] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const changeParam = <K extends keyof ParticleSpaceParams>(
    key: K,
    value: ParticleSpaceParams[K],
  ) => {
    controller.setParam(key, value);
    setParams((current) => ({ ...current, [key]: value }));
  };

  const togglePause = () => {
    controller.setPaused(!paused);
    setPaused(!paused);
  };

  const toggleErase = () => {
    controller.setEraseBackground(!eraseBackground);
    setEraseBackground(!eraseBackground);
  };

  const reset = () => {
    controller.reset();
    setParams(DEFAULT_PARAMS);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("input, button, summary")) return;

      const key = event.key.toLowerCase();
      if (key === "h") setIsPanelOpen((open) => !open);
      else if (key === "e") toggleErase();
      else if (key === " ") {
        event.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const renderControl = (control: Control) => {
    const id = `particle-space-${control.key}`;

    if (control.kind === "checkbox") {
      return (
        <div className="ps-control" key={control.key} title={control.tip}>
          <label htmlFor={id}>{control.label}</label>
          <input
            id={id}
            type="checkbox"
            checked={params[control.key]}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              changeParam(control.key, event.target.checked)
            }
          />
        </div>
      );
    }

    return (
      <div className="ps-control" key={control.key} title={control.tip}>
        <label htmlFor={id}>{control.label}</label>
        <span className="ps-value">
          {formatValue(control, params[control.key])}
        </span>
        <input
          id={id}
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={params[control.key]}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            changeParam(control.key, Number(event.target.value))
          }
        />
      </div>
    );
  };

  return (
    <div className="particle-space">
      <P5Sketch sketch={controller.sketch} className="ps-canvas" />
      <button
        type="button"
        className="ps-toggle"
        title="Show/hide controls (H)"
        aria-expanded={isPanelOpen}
        onClick={() => setIsPanelOpen((open) => !open)}
      >
        {isPanelOpen ? "◀" : "▶"}
      </button>
      {isPanelOpen && (
        <div className="ps-panel">
          <div className="ps-actions">
            <button type="button" className="ps-wide" onClick={toggleErase}>
              Erase background: {eraseBackground ? "On" : "Off"}
            </button>
            <button type="button" onClick={togglePause}>
              {paused ? "Resume" : "Pause"}
            </button>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </div>
          {UI_SECTIONS.map((section) => (
            <details key={section.title} open={section.open}>
              <summary>{section.title}</summary>
              {section.controls.map(renderControl)}
            </details>
          ))}
          <div className="ps-hint">Keys: H panel · Space pause · E erase</div>
        </div>
      )}
    </div>
  );
}
