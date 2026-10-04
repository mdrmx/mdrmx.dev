import { Fragment } from "react";
import "./SoundCloudEmbed.css";

type SoundCloudLink = {
  href: string;
  title: string;
  /** Visible text; the link is icon-less and text-less when omitted. */
  label?: string;
};

type SoundCloudEmbedProps = {
  /** SoundCloud API or page URL of the track, set or playlist. */
  resourceUrl: string;
  title: string;
  height?: number;
  color?: string;
  links?: SoundCloudLink[];
};

function buildPlayerUrl(resourceUrl: string, color: string) {
  const params = new URLSearchParams({
    url: resourceUrl,
    color,
    auto_play: "false",
    hide_related: "false",
    show_comments: "true",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "true",
    visual: "true",
  });
  return `https://w.soundcloud.com/player/?${params}`;
}

// Player and credits are returned as siblings so the host layout positions both.
export function SoundCloudEmbed({
  resourceUrl,
  title,
  height = 300,
  color = "#ff5500",
  links = [],
}: SoundCloudEmbedProps) {
  return (
    <>
      <iframe
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="no"
        allow="autoplay; encrypted-media"
        title={title}
        src={buildPlayerUrl(resourceUrl, color)}
      />
      <div className="soundcloud-attribution">
        {links.map((link, index) => (
          <Fragment key={link.href}>
            {index > 0 && " · "}
            <a
              href={link.href}
              title={link.title}
              aria-label={link.label ? undefined : link.title}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          </Fragment>
        ))}
      </div>
    </>
  );
}
