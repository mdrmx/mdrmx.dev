import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProjectPhase =
  | "home"
  | "retracting-intro"
  | "retracting-cards"
  | "expanding-card"
  | "expanded"
  | "shrinking-card"
  | "restoring-cards"
  | "restoring-intro";

// Animation timing lives here: durations in seconds, handoff in milliseconds.
const TIMING = {
  layoutDuration: 0.9,
  sequenceDuration: 0.7,
  handoffMs: 950,
};
const LAYOUT_EASE = [0.22, 1, 0.36, 1] as const;
const SEQUENCE_EASE = [0.9, 1, 0.36, 1] as const;
const REDUCED_MOTION_HANDOFF_MS = 25;
const SIDE_CARD_COUNT = 2;
// Shared-element id linking the featured card to the expanded overlay.
const LAYOUT_ID = "code-art-card";

/**
 * Drives the open/close choreography:
 * intro collapses -> side cards slide away -> featured card expands into an overlay,
 * then the same steps in reverse.
 */
export function useProjectSequence() {
  const [phase, setPhase] = useState<ProjectPhase>("home");
  const prefersReducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const settledSideCards = useRef(0);
  const hasOpened = useRef(false);

  const layoutTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: TIMING.layoutDuration, ease: LAYOUT_EASE };
  const sequenceTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: TIMING.sequenceDuration, ease: SEQUENCE_EASE };

  const isIntroCollapsed = phase !== "home" && phase !== "restoring-intro";
  const areSideCardsAway =
    phase === "retracting-cards" ||
    phase === "expanding-card" ||
    phase === "expanded" ||
    phase === "shrinking-card";
  const isOverlayOpen =
    phase === "expanding-card" ||
    phase === "expanded" ||
    phase === "shrinking-card";
  const isFeaturedCardVisible =
    phase !== "expanding-card" && phase !== "expanded";
  const isExpanded = phase === "expanded";
  const isClosing = phase === "shrinking-card";

  useEffect(() => {
    if (phase !== "expanding-card" && phase !== "shrinking-card") return;

    const nextPhase =
      phase === "expanding-card" ? "expanded" : "restoring-cards";
    const timeout = window.setTimeout(
      () => setPhase(nextPhase),
      prefersReducedMotion ? REDUCED_MOTION_HANDOFF_MS : TIMING.handoffMs,
    );

    return () => window.clearTimeout(timeout);
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    if (phase === "home" && hasOpened.current) triggerRef.current?.focus();
  }, [phase]);

  const open = useCallback(() => {
    hasOpened.current = true;
    setPhase("retracting-intro");
  }, []);

  const close = useCallback(() => setPhase("shrinking-card"), []);

  const onIntroAnimationComplete = () => {
    if (phase === "retracting-intro") {
      settledSideCards.current = 0;
      setPhase("retracting-cards");
    } else if (phase === "restoring-intro") {
      setPhase("home");
    }
  };

  const onSideAnimationComplete = () => {
    if (phase !== "retracting-cards" && phase !== "restoring-cards") return;

    settledSideCards.current += 1;
    if (settledSideCards.current < SIDE_CARD_COUNT) return;

    settledSideCards.current = 0;
    setPhase(
      phase === "retracting-cards" ? "expanding-card" : "restoring-intro",
    );
  };

  return {
    layoutId: LAYOUT_ID,
    triggerRef,
    open,
    close,
    isIntroCollapsed,
    areSideCardsAway,
    isOverlayOpen,
    isFeaturedCardVisible,
    isExpanded,
    isClosing,
    layoutTransition,
    sequenceTransition,
    onIntroAnimationComplete,
    onSideAnimationComplete,
  };
}

export type ProjectSequence = ReturnType<typeof useProjectSequence>;
