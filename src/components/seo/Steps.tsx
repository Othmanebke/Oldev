import { STEPS } from "@/lib/seoPages";

/** How a project runs: one line per step (number | title | text). */
export default function Steps() {
  return (
    <ol className="m-0 flex list-none flex-col p-0">
      {STEPS.map((s, i) => (
        <li
          key={s.title}
          className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-t border-[rgba(17,17,17,.12)] py-6 last:border-b min-[760px]:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.5fr)] min-[760px]:gap-x-8"
        >
          <span className="text-[20px] font-bold leading-[1.3] text-abcs-red" style={{ fontFamily: "var(--font-archivo-flex), sans-serif" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="m-0 text-[18px] font-semibold leading-[1.4] text-[#111]">{s.title}</h3>
          <p className="col-start-2 m-0 text-[15px] leading-[1.6] text-[#555] text-pretty min-[760px]:col-start-3">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
