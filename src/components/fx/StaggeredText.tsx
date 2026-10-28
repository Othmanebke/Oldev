import type { CSSProperties } from "react";

type Props = {
  text: string;
  /** Unit that staggers in. */
  by?: "letter" | "word";
  /** Shown (staggered) when true, hidden at once when false — replays on every switch. */
  play: boolean;
  /** Seconds before the first unit. */
  delay?: number;
  /** Seconds between two units. */
  step?: number;
  className?: string;
  style?: CSSProperties;
};

const EASE = "cubic-bezier(.22,1,.36,1)";

/**
 * Text that staggers in by letter or word (rise + blur + fade), driven by `play`.
 * Words never break inside; screen readers get the plain text. Reduced motion
 * shows it as is (the global rule cuts the transitions).
 */
export default function StaggeredText({ text, by = "word", play, delay = 0, step = 0.035, className = "", style }: Props) {
  const words = text.split(" ");
  let n = 0;
  const unit = (content: string, key: number) => {
    const i = n++;
    return (
      <span
        key={key}
        className="inline-block will-change-[transform,opacity,filter]"
        style={{
          opacity: play ? 1 : 0,
          transform: play ? "none" : "translateY(.45em)",
          filter: play ? "blur(0)" : "blur(8px)",
          transition: play ? `opacity .6s ${EASE}, transform .8s ${EASE}, filter .6s ${EASE}` : "opacity .2s, transform 0s .2s, filter 0s .2s",
          transitionDelay: play ? `${(delay + i * step).toFixed(3)}s` : "0s",
        }}
      >
        {content}
      </span>
    );
  };

  return (
    <span className={className} style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, wi) => (
          <span key={wi}>
            {wi > 0 && " "}
            <span className="inline-block whitespace-nowrap">{by === "word" ? unit(w, 0) : Array.from(w).map((ch, ci) => unit(ch, ci))}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
