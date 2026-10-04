import { ExpandableCardTrigger } from "../components/ExpandableCard";
import { ProjectCardFace } from "../components/ProjectCardFace";
import { SlideAway } from "../components/SlideAway";
import { SlideIn } from "../components/SlideIn";
import { SoundCloudEmbed } from "../components/SoundCloudEmbed";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { ProjectSequence } from "../hooks/useProjectSequence";
import nestedLogo from "../assets/nested-logo.png";
import towerGrid from "../assets/tower-grid.png";

const SOUND_LINKS = [
  { href: "https://soundcloud.com/orrest_sound", title: "Orrest" },
  { href: "https://soundcloud.com/orrest_sound/sets/demos", title: "Demos" },
];

export function WorkSection({ sequence }: { sequence: ProjectSequence }) {
  const isStacked = useMediaQuery("(max-width: 760px)");

  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="section-heading">
        <h3 className="eyebrow">[ 01 / work ]</h3>
      </div>
      <div className="project-grid">
        <SlideIn as="article" className="project project-signal">
          <SlideAway
            as="a"
            className="project-content"
            href="https://www.nestedcinema.com/"
            away={sequence.areSideCardsAway}
            edge={isStacked ? "top" : "left"}
            transition={sequence.sequenceTransition}
            onSettled={sequence.onSideAnimationComplete}
          >
            <ProjectCardFace index="01" title="Research">
              <img className="project-image" src={nestedLogo} alt="" />
            </ProjectCardFace>
          </SlideAway>
        </SlideIn>
        <SlideIn as="article" className="project project-frame" delay={0.1}>
          <ExpandableCardTrigger
            layoutId={sequence.layoutId}
            layoutTransition={sequence.layoutTransition}
            visible={sequence.isFeaturedCardVisible}
            label="Expand Code + Art project"
            className="project-content project-content-button"
            buttonRef={sequence.triggerRef}
            onClick={sequence.open}
          >
            <ProjectCardFace index="02" title="Code + Art">
              {!sequence.isClosing && (
                <img className="project-image" src={towerGrid} alt="" />
              )}
            </ProjectCardFace>
          </ExpandableCardTrigger>
        </SlideIn>
        <SlideIn as="article" className="project project-field" delay={0.2}>
          <SlideAway
            className="project-content"
            away={sequence.areSideCardsAway}
            edge={isStacked ? "bottom" : "right"}
            transition={sequence.sequenceTransition}
            onSettled={sequence.onSideAnimationComplete}
          >
            <ProjectCardFace index="03" title="Sound">
              <SoundCloudEmbed
                resourceUrl="https://api.soundcloud.com/playlists/soundcloud%3Aplaylists%3A1390056265"
                title="SoundCloud playlist: Demos"
                links={SOUND_LINKS}
              />
            </ProjectCardFace>
          </SlideAway>
        </SlideIn>
      </div>
    </section>
  );
}
