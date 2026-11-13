/**
 * OTHLEDEV wordmark (inline SVG, inherits the text color). Height comes from `className`, width stays auto.
 * Geometric letters, 203 high, 58 strokes, 29 chamfers, with a small tab on the top-left of each stem.
 */
const LETTERS: [x: number, d: string][] = [
  [0, "M29 0H193L222 29V174L193 203H29L0 174V29Z M58 58V145H164V58Z"], // O
  [244, "M0 0H200V58H129V203H71V58H0Z"], // T
  [466, "M0 0H80V73H142V0H200V203H142V131H80V203H22V58H0Z"], // H
  [688, "M0 0H80V145H209V203H22V58H0Z"], // L
  [919, "M0 0H209V58H79V73H180V131H79V145H209V203H22V58H0Z"], // E
  [1150, "M0 0H186L215 29V174L186 203H21V73H79V145H157V58H0Z"], // D
  [1387, "M0 0H209V58H79V73H180V131H79V145H209V203H22V58H0Z"], // E
  [1618, "M0 0H63L104 89L125 147L147 89L188 0H251L157 203H93L26 58H0Z"], // V
];

export const LOGO_VIEWBOX = "0 0 1869 203";
export const LOGO_PATHS = LETTERS.map(([x, d]) => ({ x, d }));

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} fill="currentColor" fillRule="evenodd" role="img" aria-label="othledev" className={`block w-auto ${className}`}>
      {LOGO_PATHS.map(({ x, d }, i) => (
        // "LE" (4th and 5th letters) in the brand orange
        <path key={x} transform={`translate(${x} 0)`} d={d} {...(i === 3 || i === 4 ? { fill: "var(--color-abcs-red)" } : {})} />
      ))}
    </svg>
  );
}
