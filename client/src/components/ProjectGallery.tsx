import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { AdaptiveImage } from "./AdaptiveImage";
import { TileGrid, type TileItem } from "./TileGrid";
import "./ProjectGallery.css";

export type GalleryProject = TileItem & {
  /** Replaces the default image and description, e.g. a p5 sketch. Mounted once the expand animation settles. */
  content?: ReactNode;
};

type ProjectGalleryProps = {
  projects: GalleryProject[];
  /** Distinguishes layout ids when several galleries share a page. */
  id?: string;
};

const SETTLE_FALLBACK_MS = 1000;

type ProjectDetailProps = {
  project: GalleryProject;
  layoutId: string;
  onBack: () => void;
};

function ProjectDetail({ project, layoutId, onBack }: ProjectDetailProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isSettled, setIsSettled] = useState(false);

  // onLayoutAnimationComplete doesn't fire when no layout animation was needed.
  useEffect(() => {
    const timeout = window.setTimeout(
      () => setIsSettled(true),
      SETTLE_FALLBACK_MS,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <motion.section
      className="gallery-detail"
      layoutId={layoutId}
      transition={{
        layout: prefersReducedMotion
          ? { duration: 0.01 }
          : { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      onLayoutAnimationComplete={() => setIsSettled(true)}
    >
      <header className="gallery-detail__bar">
        <button type="button" className="gallery-detail__back" onClick={onBack}>
          ← Back
        </button>
        <h2>{project.title}</h2>
      </header>
      <div className="gallery-detail__content">
        {project.content && isSettled ? (
          project.content
        ) : (
          <div className="gallery-detail__info">
            {project.image && (
              <AdaptiveImage
                wide={project.image}
                square={project.imageSquare}
                alt={project.imageAlt}
              />
            )}
            {project.description && <p>{project.description}</p>}
          </div>
        )}
      </div>
    </motion.section>
  );
}

/** A grid of project tiles; selecting one expands it to fill the gallery's space. */
export function ProjectGallery({
  projects,
  id = "gallery",
}: ProjectGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((project) => project.id === selectedId);

  if (selected) {
    return (
      <ProjectDetail
        project={selected}
        layoutId={`${id}-${selected.id}`}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  return (
    <TileGrid items={projects} layoutIdPrefix={id} onSelect={setSelectedId} />
  );
}
