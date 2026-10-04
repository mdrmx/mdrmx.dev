export type ParticleSpaceParams = {
  count: number;
  showNodes: boolean;
  maxSpeed: number;
  lineDist: number;
  maxConn: number;
  showLines: boolean;
  showFills: boolean;
  repelRadius: number;
  repelStrength: number;
  cellSize: number;
  flowStrength: number;
  noiseDetail: number;
  turns: number;
  evolveSpeed: number;
  driftSpeed: number;
};

type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

export type SliderControl = {
  kind?: "slider";
  key: KeysOfType<ParticleSpaceParams, number>;
  label: string;
  tip: string;
  min: number;
  max: number;
  step: number;
  value: number;
  decimals?: number;
};

export type CheckboxControl = {
  kind: "checkbox";
  key: KeysOfType<ParticleSpaceParams, boolean>;
  label: string;
  tip: string;
  value: boolean;
};

export type Control = SliderControl | CheckboxControl;

export type ControlSection = {
  title: string;
  open: boolean;
  controls: Control[];
};

export const PALETTE_HEX = [
  "#6fb6ba",
  "#b1d9c3",
  "#eb5e54",
  "#f6c900",
  "#d8d2c4",
  "#00313d",
];

export const PARTICLE_SIZE = 3;
export const TRAIL_ALPHA = 5;

export const UI_SECTIONS: ControlSection[] = [
  {
    title: "Particles",
    open: true,
    controls: [
      {
        key: "count",
        label: "Count",
        tip: "Number of particles",
        min: 10,
        max: 600,
        step: 1,
        value: 150,
      },
      {
        key: "showNodes",
        label: "Show particles",
        kind: "checkbox",
        tip: "Draw a dot at each particle",
        value: false,
      },
      {
        key: "maxSpeed",
        label: "Max speed",
        tip: "Speed limit of each particle",
        min: 0.05,
        max: 3,
        step: 0.05,
        value: 0.4,
        decimals: 2,
      },
    ],
  },
  {
    title: "Connections",
    open: true,
    controls: [
      {
        key: "lineDist",
        label: "Link distance",
        tip: "Particles closer than this are joined by a line",
        min: 10,
        max: 200,
        step: 1,
        value: 40,
      },
      {
        key: "maxConn",
        label: "Max links per particle",
        tip: "Caps how many lines each particle can have",
        min: 1,
        max: 15,
        step: 1,
        value: 3,
      },
      {
        key: "showLines",
        label: "Show lines",
        kind: "checkbox",
        tip: "Draw the connecting lines",
        value: true,
      },
      {
        key: "showFills",
        label: "Fill triangles",
        kind: "checkbox",
        tip: "Fill fully connected triplets with colour",
        value: true,
      },
    ],
  },
  {
    title: "Repulsion",
    open: false,
    controls: [
      {
        key: "repelRadius",
        label: "Radius",
        tip: "Distance within which particles push each other away",
        min: 5,
        max: 300,
        step: 1,
        value: 40,
      },
      {
        key: "repelStrength",
        label: "Strength",
        tip: "How hard particles push apart (0 = off)",
        min: 0,
        max: 3,
        step: 0.01,
        value: 0.3,
        decimals: 2,
      },
    ],
  },
  {
    title: "Flow field",
    open: false,
    controls: [
      {
        key: "cellSize",
        label: "Cell size",
        tip: "Size in pixels of each flow-field cell",
        min: 5,
        max: 100,
        step: 1,
        value: 10,
      },
      {
        key: "flowStrength",
        label: "Flow strength",
        tip: "How strongly the field steers particles",
        min: 0,
        max: 0.6,
        step: 0.01,
        value: 0.2,
        decimals: 2,
      },
      {
        key: "noiseDetail",
        label: "Detail",
        tip: "Spatial frequency of the noise: higher = more turbulent",
        min: 0.0005,
        max: 0.2,
        step: 0.0005,
        value: 0.05,
        decimals: 3,
      },
      {
        key: "turns",
        label: "Angle range (turns)",
        tip: "How many full turns the noise can rotate a direction",
        min: 1,
        max: 10,
        step: 1,
        value: 5,
      },
      {
        key: "evolveSpeed",
        label: "Evolution speed",
        tip: "How fast the field changes over time",
        min: 0.0001,
        max: 0.01,
        step: 0.0001,
        value: 0.002,
        decimals: 4,
      },
      {
        key: "driftSpeed",
        label: "Drift speed",
        tip: "How fast the field slides sideways",
        min: 0.00005,
        max: 0.003,
        step: 0.00001,
        value: 0.0001,
        decimals: 5,
      },
    ],
  },
];

export const DEFAULT_PARAMS = Object.fromEntries(
  UI_SECTIONS.flatMap((section) =>
    section.controls.map((control) => [control.key, control.value]),
  ),
) as ParticleSpaceParams;
