import { X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { useEffect, useRef, type ReactNode, type Ref } from "react";
import "./ExpandableCard.css";

type ExpandableCardTriggerProps = {
  /** Must match the overlay's `layoutId` so the card morphs into it. */
  layoutId: string;
  layoutTransition: Transition;
  visible: boolean;
  label: string;
  onClick: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
  className?: string;
  children: ReactNode;
};

export function ExpandableCardTrigger({
  layoutId,
  layoutTransition,
  visible,
  label,
  onClick,
  buttonRef,
  className,
  children,
}: ExpandableCardTriggerProps) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.button
          key={layoutId}
          ref={buttonRef}
          type="button"
          className={className}
          layoutId={layoutId}
          layoutCrossfade={false}
          transition={{ layout: layoutTransition }}
          aria-label={label}
          onClick={onClick}
        >
          {children}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

type ExpandableCardOverlayProps = {
  layoutId: string;
  layoutTransition: Transition;
  open: boolean;
  /** Settled state: enables the close button, Escape key and focus. */
  expanded: boolean;
  closing: boolean;
  eyebrow: string;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
};

export function ExpandableCardOverlay({
  layoutId,
  layoutTransition,
  open,
  expanded,
  closing,
  eyebrow,
  title,
  closeLabel,
  onClose,
  children,
}: ExpandableCardOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const { overflow, paddingRight } = document.body.style;
    // Pad by the scrollbar width so the page doesn't shift when it disappears.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (!expanded) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`overlay-stage${closing ? " overlay-stage--closing" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
        >
          <motion.article
            className={`overlay-card${closing ? " overlay-card--closing" : ""}`}
            layoutId={layoutId}
            layoutCrossfade={false}
            transition={{ layout: layoutTransition }}
          >
            <div className="overlay-body">{children}</div>
            <div className="overlay-caption">
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
            </div>
            <button
              ref={closeButtonRef}
              className="overlay-close"
              type="button"
              title="Close project"
              aria-label={closeLabel}
              disabled={!expanded}
              onClick={onClose}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
