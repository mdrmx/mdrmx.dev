import "./App.css";
import { LayoutGroup } from "motion/react";
import { useProjectSequence } from "./hooks/useProjectSequence";
import { AboutSection } from "./sections/AboutSection";
import { CodeArtOverlay } from "./sections/CodeArtOverlay";
import { IntroPanel } from "./sections/IntroPanel";
import { SiteFooter } from "./sections/SiteFooter";
import { SiteHeader } from "./sections/SiteHeader";
import { WorkSection } from "./sections/WorkSection";

function App() {
  const sequence = useProjectSequence();

  return (
    <LayoutGroup id="work-projects">
      <div className="site-shell">
        <SiteHeader />
        <main id="top">
          <IntroPanel
            collapsed={sequence.isIntroCollapsed}
            transition={sequence.sequenceTransition}
            onAnimationComplete={sequence.onIntroAnimationComplete}
          />
          <WorkSection sequence={sequence} />
          <AboutSection />
        </main>
        <SiteFooter />
        <CodeArtOverlay sequence={sequence} />
      </div>
    </LayoutGroup>
  );
}

export default App;
