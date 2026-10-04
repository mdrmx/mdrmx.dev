import type { Transition } from "motion/react";
import { Collapsible } from "../components/Collapsible";
import { SlideDown } from "../components/SlideIn";
import { SlitScanBackground } from "../components/SlitScanBackground";
import { TypewriterText } from "../components/TypewriterText";

type IntroPanelProps = {
  collapsed: boolean;
  transition: Transition;
  onAnimationComplete: () => void;
};

export function IntroPanel({
  collapsed,
  transition,
  onAnimationComplete,
}: IntroPanelProps) {
  return (
    <Collapsible
      collapsed={collapsed}
      transition={transition}
      onAnimationComplete={onAnimationComplete}
    >
      <SlideDown className="intro">
        <div className="intro-copy">
          <SlitScanBackground />
        </div>
        <div className="intro-detail">
          <TypewriterText text="Listen, kid, we're all in it together." />
        </div>
      </SlideDown>
    </Collapsible>
  );
}
