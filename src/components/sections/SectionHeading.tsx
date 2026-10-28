import { archivo } from "@/components/sections/layout";

/** Small orange kicker over the section's <h2> (centred by default). */
export default function SectionHeading({ kicker, title, align = "center" }: { kicker: string; title: string; align?: "center" | "left" }) {
  return (
    <div data-reveal className={`flex flex-col gap-2.5 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      <span className="text-[12px] font-semibold tracking-[.14em] text-abcs-red">{kicker}</span>
      <h2 className="m-0 font-semibold tracking-[-.03em] text-[#f4f4f2] text-balance" style={{ ...archivo, fontSize: "clamp(28px,3.4vw,44px)" }}>
        {title}
      </h2>
    </div>
  );
}
