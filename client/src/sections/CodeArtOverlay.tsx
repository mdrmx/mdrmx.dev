import { ExpandableCardOverlay } from "../components/ExpandableCard";
import {
  ProjectGallery,
  type GalleryProject,
} from "../components/ProjectGallery";
import type { ProjectSequence } from "../hooks/useProjectSequence";
import { ParticleSpace } from "../sketches/particle-space/ParticleSpace";
import { SnakeTrails } from "../sketches/snake-trails/SnakeTrails";
import { Gromleyfier } from "../sketches/gromleyfier/Gromleyfier";
import particle from "../assets/particle.png";
import trails from "../assets/trails.png";
import trailsSquare from "../assets/trails-square.png";
import letters from "../assets/matter-letters.jpg";
import gromleyfier from "../assets/gromleyfier.png";
const SERIES: GalleryProject[] = [
  {
    id: "gromleyfier",
    title: "Gromleyfier",
    image: gromleyfier,
    description:
      "A tool for gormleyfying 3D models, inspired by Antony Gormley's Quantum Cloud (1999).",
    content: <Gromleyfier />,
  },
  {
    id: "particle-field",
    title: "Particle Field",
    image: particle,
    description: "A generative particle system with interactive forces.",
    content: <ParticleSpace />,
  },
  {
    id: "typography-series",
    title: "Snake Trails",
    image: trails,
    imageSquare: trailsSquare,
    description:
      "A grid of generative elements that are self-avoiding and leave trails.",
    content: <SnakeTrails />,
  },
  // {
  //   id: "matter-letters",
  //   title: "Matter Physics Typography",
  //   image: letters,
  //   imageSquare: letters,
  //   description:
  //     "A generative typography experiment using the Matter physics engine.",
  // },
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
