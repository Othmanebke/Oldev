import { STEPS } from "@/lib/seoPages";

/** How a project runs: one line per step (number | title | text). */
export default function Steps() {
  return (
    <ol className="m-0 flex list-none flex-col p-0">
      {STEPS.map((s, i) => (
        <li
          key={s.title}
          className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-t border-white/10 py-6 last:border-b min-[760px]:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.5fr)] min-[760px]:gap-x-8"
        >
          <span className="font-mono text-[14px] leading-[1.9] tracking-[.14em] text-abcs-red">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="m-0 text-[19px] font-semibold leading-[1.4] tracking-[-.02em] text-white" style={{ fontFamily: "var(--font-archivo-flex), sans-serif" }}>
            {s.title}
          </h3>
          <p className="col-start-2 m-0 text-[16px] leading-[1.6] text-[#b5b5b5] text-pretty max-sm:text-[15px] min-[760px]:col-start-3">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
