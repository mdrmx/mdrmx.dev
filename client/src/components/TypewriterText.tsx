import { motion } from "motion/react";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";

type TypewriterTextProps = {
  text: string;
  className?: string;
};

/** Types `text` out once, the first time the paragraph scrolls into view. */
export function TypewriterText({ text, className }: TypewriterTextProps) {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <motion.p
      className={className}
      style={{ minHeight: "1lh" }}
      onViewportEnter={() => setHasEntered(true)}
      viewport={{ once: true }}
    >
      {hasEntered && (
        <TypeAnimation sequence={[text]} wrapper="span" cursor repeat={0} />
      )}
    </motion.p>
  );
}
