import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { motion } from "motion/react";
import { AdaptiveImage } from "./AdaptiveImage";

export type TileItem = {
  id: string;
  title: string;
  image?: string;
  /** Shown instead of `image` when the image box is closer to square than wide. */
  imageSquare?: string;
  /** Empty by default, since the title usually describes the image. */
  imageAlt?: string;
  description?: string;
};

type TileGridProps = {
  items: TileItem[];
  onSelect: (id: string) => void;
  /** Each tile gets layoutId `${layoutIdPrefix}-${id}` so a detail view can morph from it. */
  layoutIdPrefix: string;
};

export function TileGrid({ items, onSelect, layoutIdPrefix }: TileGridProps) {
  return (
    <Grid
      container
      columns={{ xs: 1, sm: 2 }}
      spacing={2}
      sx={{
        width: "100%",
        minHeight: "100%",
        alignContent: "center",
        p: { xs: 2, sm: 4 },
        "& .MuiPaper-root": {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 1.5,
          width: "100%",
          height: "100%",
          minHeight: 140,
          p: 2.5,
          border: "3px solid var(--ink)",
          borderRadius: 1,
          bgcolor: "var(--panel)",
          color: "var(--ink)",
          boxShadow: "none",
          font: "inherit",
          textAlign: "left",
          cursor: "pointer",
          "& .tile-title": { fontSize: "1.25rem", lineHeight: 1.2 },
          "& .tile-description": { fontSize: "0.8rem", lineHeight: 1.5 },
          "& .adaptive-image": { height: 220 },
          transition:
            "transform 180ms ease, background-color 180ms ease, box-shadow 220ms ease",
          "&:hover, &:focus-visible": {
            transform: "translateY(-4px)",
            boxShadow: "6px 8px 0 rgba(27, 30, 30, 0.2)",
            border: "5px solid var(--focus)",
            outline: "none",
          },
        },
      }}
    >
      {items.map(
        ({ id, title, image, imageSquare, imageAlt = "", description }) => (
          <Grid key={id} size={1}>
            <motion.div
              layoutId={`${layoutIdPrefix}-${id}`}
              style={{ height: "100%" }}
            >
              <Paper
                component="button"
                type="button"
                onClick={() => onSelect(id)}
              >
                {image && (
                  <AdaptiveImage
                    wide={image}
                    square={imageSquare}
                    alt={imageAlt}
                  />
                )}
                <span className="tile-title">{title}</span>
                {description && (
                  <span className="tile-description">{description}</span>
                )}
              </Paper>
            </motion.div>
          </Grid>
        ),
      )}
    </Grid>
  );
}
