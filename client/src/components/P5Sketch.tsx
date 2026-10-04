import { useEffect, useRef } from "react";
import { runP5Sketch, type P5SketchFactory } from "../utils/runP5Sketch";

export type { P5SketchFactory };

type P5SketchProps = {
  /** Keep this reference stable; a new function restarts the sketch. */
  sketch: P5SketchFactory;
  className?: string;
};

export function P5Sketch({ sketch, className }: P5SketchProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    return runP5Sketch(sketch, host);
  }, [sketch]);

  return <div ref={hostRef} className={className} />;
}
