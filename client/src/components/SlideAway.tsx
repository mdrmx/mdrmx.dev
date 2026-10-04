//A component for sliding an element off the viewport edge and fading it out.
// It uses  motion library for animations and allows customization of the slide direction, transition, and optional anchor rendering.

import { motion, type Transition, type Variants } from "motion/react";
import {
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type SlideAwayEdge = "left" | "right" | "top" | "bottom";

type SlideAwayTag =
  | "div"
  | "a"
  | "article"
  | "section"
  | "aside"
  | "li"
  | "button"
  | "span";

type SlideAwayProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "onAnimationComplete"
> & {
  children: ReactNode;
  /** Element to render; defaults to a div. */
  as?: SlideAwayTag;
  /** Slides the element off the viewport edge and fades it out when true. */
  away: boolean;
  edge: SlideAwayEdge;
  transition: Transition;
  /** Fires after each slide in either direction. */
  onSettled?: () => void;
  /** Forwarded when rendering `as="a"`. */
  href?: string;
  target?: string;
  rel?: string;
};

// Calculates the offscreen offset for the given edge and element size.
function getOffscreenOffset(element: HTMLElement | null, edge: SlideAwayEdge) {
  if (!element) return { x: 0, y: 0 };

  const { width, height } = element.getBoundingClientRect();
  const x = window.innerWidth + width + 32;
  const y = window.innerHeight + height + 32;

  if (edge === "left") return { x: -x, y: 0 };
  if (edge === "right") return { x, y: 0 };
  if (edge === "top") return { x: 0, y: -y };
  return { x: 0, y };
}
// The SlideAway component slides an element off the viewport edge and fades it out when the 'away' prop is true.
// It uses motion for animations and allows customization of the slide direction, transition, and optional anchor rendering.
export function SlideAway({
  children,
  as = "div",
  away,
  edge,
  transition,
  onSettled,
  ...elementProps
}: SlideAwayProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const MotionElement: ElementType = motion[as];

  // A function variant is measured when the slide starts, so it tracks viewport size.
  const variants: Variants = {
    present: { x: 0, y: 0, opacity: 1 },
    away: () => ({ ...getOffscreenOffset(element, edge), opacity: 0 }),
  };

  return (
    <MotionElement
      {...elementProps}
      ref={setElement}
      variants={variants}
      initial={false}
      animate={away ? "away" : "present"}
      transition={transition}
      onAnimationComplete={onSettled}
    >
      {children}
    </MotionElement>
  );
}
