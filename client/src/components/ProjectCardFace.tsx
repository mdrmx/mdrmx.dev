import type { ReactNode } from "react";
import "./ProjectCardFace.css";

type ProjectCardFaceProps = {
  /** Small label pinned to the top-left of the artwork, e.g. "01". */
  index: string;
  title: string;
  /** Artwork shown inside the framed square. */
  children: ReactNode;
};

export function ProjectCardFace({
  index,
  title,
  children,
}: ProjectCardFaceProps) {
  return (
    <>
      <div className="project-art" aria-hidden="true">
        {children}
        <span className="project-index">{index}</span>
      </div>
      <div className="project-caption">
        <h2>{title}</h2>
      </div>
    </>
  );
}
