import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealElement = "article" | "div" | "section";
type RevealDirection = "left" | "down";
type RevealTrigger = "mount" | "view";

type RevealProps = {
  as?: RevealElement;
  children: ReactNode;
  className?: string;
  delay?: number;
  direction: RevealDirection;
  trigger: RevealTrigger;
};

function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  direction,
  trigger,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionElement =
    as === "article"
      ? motion.article
      : as === "section"
        ? motion.section
        : motion.div;
  const initialState =
    direction === "left"
      ? { opacity: 0, x: -72 }
      : { clipPath: "inset(0 0 100% 0)", y: -64 };
  const visibleState =
    direction === "left"
      ? { opacity: 1, x: 0 }
      : { clipPath: "inset(0 0 0% 0)", y: 0 };
  const transition =
    direction === "left"
      ? {
          type: "spring" as const,
          stiffness: 15,
          damping: 10,
          mass: 2,
          delay,
        }
      : {
          type: "spring" as const,
          stiffness: 45,
          damping: 30,
          mass: 0.2,
          delay,
        };

  return (
    <MotionElement
      className={className}
      initial={prefersReducedMotion ? false : initialState}
      animate={
        trigger === "mount" && !prefersReducedMotion ? visibleState : undefined
      }
      whileInView={
        trigger === "view" && !prefersReducedMotion ? visibleState : undefined
      }
      viewport={trigger === "view" ? { amount: 0.2, once: true } : undefined}
      transition={transition}
    >
      {children}
    </MotionElement>
  );
}

type SlideInProps = Omit<RevealProps, "direction" | "trigger">;

export function SlideIn(props: SlideInProps) {
  return <Reveal {...props} direction="left" trigger="view" />;
}

export function SlideDown(props: SlideInProps) {
  return <Reveal {...props} as="section" direction="down" trigger="mount" />;
}
