import { Settings2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type p5 from "p5";
import defaultImageSource from "../assets/image.png";
import { runP5Sketch } from "../utils/runP5Sketch";

export type SlitScanSource = "image" | "webcam";

type ScanSettings = {
  rows: number;
  columns: number;
  noiseScale: number;
  speed: number;
};

type SlitScanBackgroundProps = {
  source?: SlitScanSource;
  imageSource?: string;
  showControls?: boolean;
  className?: string;
};

const DEFAULT_SETTINGS: ScanSettings = {
  rows: 40,
  columns: 60,
  noiseScale: 0.007,
  speed: 0.0013,
};

export function SlitScanBackground({
  source = "image",
  imageSource = defaultImageSource,
  showControls = true,
  className = "",
}: SlitScanBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const controlsId = useId();

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    return runP5Sketch((p) => {
      let resizeObserver: ResizeObserver | undefined;
      let imageBuffer: p5.Image | undefined;
      let cameraBuffer: p5.Element | undefined;

      const resizeCanvas = () => {
        const bounds = host.getBoundingClientRect();
        p.resizeCanvas(Math.max(1, bounds.width), Math.max(1, bounds.height));
      };

      p.setup = () => {
        const bounds = host.getBoundingClientRect();
        const canvas = p.createCanvas(
          Math.max(1, bounds.width),
          Math.max(1, bounds.height),
        );
        canvas.parent(host);
        canvas.elt.setAttribute("aria-hidden", "true");
        p.pixelDensity(1);
        p.frameRate(30);

        if (source === "image" && imageSource) {
          void p.loadImage(imageSource).then((image) => {
            imageBuffer = image;
          });
        }

        if (source === "webcam") {
          cameraBuffer = p.createCapture({ video: true, audio: false });
          cameraBuffer.elt.setAttribute("playsinline", "");
          cameraBuffer.hide();
        }

        resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(host);
      };

      p.draw = () => {
        const currentSettings = settingsRef.current;
        const tileWidth = p.width / currentSettings.columns;
        const tileHeight = p.height / currentSettings.rows;
        const activeBuffer = source === "webcam" ? cameraBuffer : imageBuffer;

        p.background("#090b0c");

        if (!activeBuffer || !activeBuffer.width || !activeBuffer.height) {
          return;
        }

        const time = p.frameCount * currentSettings.speed;
        const maxScanX = Math.max(activeBuffer.width - tileWidth, 0);
        const maxScanY = Math.max(activeBuffer.height - tileHeight, 0);

        for (let row = 0; row < currentSettings.rows; row += 1) {
          for (let column = 0; column < currentSettings.columns; column += 1) {
            const scanX = p.floor(
              p.noise(
                column * currentSettings.noiseScale,
                row * currentSettings.noiseScale,
                time,
              ) * maxScanX,
            );
            const scanY = p.floor(
              p.noise(
                column * currentSettings.noiseScale + 1000,
                row * currentSettings.noiseScale + 1000,
                time,
              ) * maxScanY,
            );

            p.image(
              activeBuffer,
              column * tileWidth,
              row * tileHeight,
              tileWidth,
              tileHeight,
              scanX,
              scanY,
              tileWidth,
              tileHeight,
            );
          }
        }
      };

      return () => resizeObserver?.disconnect();
    }, host);
  }, [imageSource, source]);

  const updateSetting = (setting: keyof ScanSettings, value: string) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [setting]: Number(value),
    }));
  };

  return (
    <div className={`slit-scan ${className}`.trim()}>
      <div className="slit-scan__canvas" ref={hostRef} />
      {showControls && (
        <>
          <button
            className="slit-scan__settings-toggle"
            type="button"
            aria-label="Toggle animation settings"
            aria-controls={controlsId}
            aria-expanded={isControlsOpen}
            title="Animation settings"
            onClick={() => setIsControlsOpen((isOpen) => !isOpen)}
          >
            <Settings2 aria-hidden="true" size={16} strokeWidth={1.8} />
          </button>
          {isControlsOpen && (
            <section
              className="slit-scan__controls"
              id={controlsId}
              aria-label="Animation settings"
            >
              <label>
                <span>Rows {settings.rows}</span>
                <input
                  type="range"
                  min="4"
                  max="80"
                  step="1"
                  value={settings.rows}
                  onChange={(event) =>
                    updateSetting("rows", event.target.value)
                  }
                />
              </label>
              <label>
                <span>Columns {settings.columns}</span>
                <input
                  type="range"
                  min="4"
                  max="80"
                  step="1"
                  value={settings.columns}
                  onChange={(event) =>
                    updateSetting("columns", event.target.value)
                  }
                />
              </label>
              <label>
                <span>Noise {settings.noiseScale.toFixed(3)}</span>
                <input
                  type="range"
                  min="0.001"
                  max="0.03"
                  step="0.001"
                  value={settings.noiseScale}
                  onChange={(event) =>
                    updateSetting("noiseScale", event.target.value)
                  }
                />
              </label>
              <label>
                <span>Speed {settings.speed.toFixed(4)}</span>
                <input
                  type="range"
                  min="0.0001"
                  max="0.005"
                  step="0.0001"
                  value={settings.speed}
                  onChange={(event) =>
                    updateSetting("speed", event.target.value)
                  }
                />
              </label>
            </section>
          )}
        </>
      )}
    </div>
  );
}
