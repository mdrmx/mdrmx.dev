import p5 from "p5";

/** Receives the p5 instance and its host element; may return a cleanup function. */
export type P5SketchFactory = (p: p5, host: HTMLElement) => void | (() => void);

// Below this fraction of the host visible, drawing is skipped.
const VISIBLE_RATIO = 0.01;

type Hook = (() => void | Promise<void>) | undefined;

/**
 * Runs a p5 sketch in `host` and returns a disposer.
 * - p5's remove() only halts the loop once a canvas exists, so a sketch disposed before its
 *   async setup finishes would keep drawing forever; guarding setup/draw prevents that.
 * - Draws are skipped (not loop()/noLoop() toggled) while hidden, which avoids duplicate frame chains.
 */
export function runP5Sketch(factory: P5SketchFactory, host: HTMLElement) {
  let disposed = false;
  let isOnScreen = true;
  let factoryCleanup: void | (() => void);

  const observer = new IntersectionObserver(
    ([entry]) => {
      isOnScreen = entry.intersectionRatio >= VISIBLE_RATIO;
    },
    { threshold: [0, VISIBLE_RATIO] },
  );
  observer.observe(host);

  const instance = new p5((p) => {
    factoryCleanup = factory(p, host);

    const userSetup = p.setup as Hook;
    const userDraw = p.draw as Hook;

    if (userSetup) {
      p.setup = () => {
        if (disposed) {
          p.noLoop();
          // remove() ran before p5 created its default canvas, so it skipped DOM cleanup
          // and that canvas would stay in the host (StrictMode's mount/unmount/mount).
          void p.remove();
          return;
        }
        return userSetup.call(p);
      };
    }

    if (userDraw) {
      p.draw = () => {
        if (disposed) {
          p.noLoop();
          return;
        }
        if (!isOnScreen || document.hidden) return;
        return userDraw.call(p);
      };
    }
  }, host);

  return () => {
    disposed = true;
    observer.disconnect();
    if (typeof factoryCleanup === "function") factoryCleanup();
    void instance.remove();
  };
}
