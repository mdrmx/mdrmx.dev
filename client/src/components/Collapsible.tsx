import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";

type CollapsibleProps = {
  collapsed: boolean;
  transition: Transition;
  onAnimationComplete?: () => void;
  className?: string;
  children: ReactNode;
};

export function Collapsible({
  collapsed,
  transition,
  onAnimationComplete,
  className,
  children,
}: CollapsibleProps) {
  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden" }}
      initial={false}
      animate={
        collapsed
          ? { height: 0, opacity: 0, y: -28 }
          : { height: "auto", opacity: 1, y: 0 }
      }
      transition={transition}
      onAnimationComplete={() => onAnimationComplete?.()}
    >
      {children}
    </motion.div>
  );
}
