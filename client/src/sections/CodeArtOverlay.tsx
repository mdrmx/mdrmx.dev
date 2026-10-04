import { ExpandableCardOverlay } from "../components/ExpandableCard";
import {
  ProjectGallery,
  type GalleryProject,
} from "../components/ProjectGallery";
import type { ProjectSequence } from "../hooks/useProjectSequence";
import { ParticleSpace } from "../sketches/particle-space/ParticleSpace";
import particle from "../assets/particle.png";

const SERIES: GalleryProject[] = [
  {
    id: "particle-field",
    title: "Particle Field",
    image: particle,
    description: "A generative particle system with interactive forces.",
    content: <ParticleSpace />,
  },
  {
    id: "typography-series",
    title: "Typography Series",
    image: particle,
    description: "A generative particle system with interactive forces.",
  },
  {
    id: "3d-xr",
    title: "3D/XR",
    image: particle,
    description: "A generative particle system with interactive forces.",
  },
  {
    id: "project-4",
    title: "4",
    image: particle,
    description: "A generative particle system with interactive forces.",
  },
  {
    id: "project-5",
    title: "4",
    image: particle,
    description: "A generative particle system with interactive forces.",
  },
  {
    id: "project-6",
    title: "4",
    image: particle,
    description: "A generative particle system with interactive forces.",
  },
];

export function CodeArtOverlay({ sequence }: { sequence: ProjectSequence }) {
  return (
    <ExpandableCardOverlay
      layoutId={sequence.layoutId}
      layoutTransition={sequence.layoutTransition}
      open={sequence.isOverlayOpen}
      expanded={sequence.isExpanded}
      closing={sequence.isClosing}
      eyebrow="[ 02 / selected work ]"
      title="Code + Art"
      closeLabel="Close Code + Art project"
      onClose={sequence.close}
    >
      <ProjectGallery projects={SERIES} />
    </ExpandableCardOverlay>
  );
}
