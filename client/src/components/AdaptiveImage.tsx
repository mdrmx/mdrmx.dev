import { useLayoutEffect, useRef, useState } from "react";
import "./AdaptiveImage.css";

type AdaptiveImageProps = {
  /** Used when the box is wide, and as the only image when `square` is omitted. */
  wide: string;
  square?: string;
  alt?: string;
};

// Halfway between square (1) and the wide artwork (~2) on a log scale.
const SQUARE_MAX_RATIO = 1.4;

/** Fills its container and picks the wide or square artwork from the container's aspect ratio. */
export function AdaptiveImage({ wide, square, alt = "" }: AdaptiveImageProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isSquare, setIsSquare] = useState(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box || !square) return;

    const measure = () => {
      // Layout size: unlike getBoundingClientRect, it ignores in-flight layout-animation transforms.
      const { clientWidth: width, clientHeight: height } = box;
      if (width > 0 && height > 0)
        setIsSquare(width / height < SQUARE_MAX_RATIO);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, [square]);

  return (
    <div ref={boxRef} className="adaptive-image">
      <img src={square && isSquare ? square : wide} alt={alt} />
    </div>
  );
}
