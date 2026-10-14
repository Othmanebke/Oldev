/**
 * Orange stroke running around a highlighted card (one lap / 5 s).
 * The trail is half the perimeter: 4 dashes sharing the same head, longer ones
 * fainter, plus a blurred glow behind and a drop-shadow on the head.
 * Parent must be `position: relative`; `radius` = the card's border-radius.
 */
const LAYERS = [
  { len: 50, o: 0, w: 8, op: 0.12, glow: true },
  { len: 50, o: 0, w: 2, op: 0.25 },
  { len: 32, o: -18, w: 2, op: 0.45 },
  { len: 18, o: -32, w: 2.5, op: 0.75 },
  { len: 8, o: -42, w: 3, op: 1, head: true },
];

export default function BorderRun({ radius }: { radius: number }) {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 z-[3] h-full w-full overflow-visible">
      {LAYERS.map((l, i) => (
        <rect
          key={i}
          className="border-run"
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={radius}
          ry={radius}
          pathLength={100}
          fill="none"
          stroke="#FF3B00"
          strokeWidth={l.w}
          strokeLinecap="round"
          strokeDasharray={`${l.len} ${100 - l.len}`}
          opacity={l.op}
          style={
            {
              "--o": l.o,
              strokeDashoffset: l.o,
              filter: l.glow ? "blur(4px)" : l.head ? "drop-shadow(0 0 6px #FF3B00)" : undefined,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}
