"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL } from "@/lib/site";

type Msg = { role: "user" | "assistant"; text: string };

const GREETING: Msg = { role: "assistant", text: "Bonjour ! Je suis l'assistant d'Othmane. Une question sur un site, un prix ou un délai ?" };
const SUGGESTS = ["Combien coûte un site vitrine ?", "Quels sont les délais ?", "Tu fais du WordPress ?"];
const FALLBACK = `Je n'arrive pas à répondre pour l'instant. Écrivez à ${EMAIL} : réponse sous 48 h.`;

/** AI assistant panel, above the bottom bar (answers come from /api/chat). */
export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  useEffect(() => {
    if (!open) return;
    // Focus without scrolling the page on phones (keyboard pops up)
    const t = setTimeout(() => field.current?.focus({ preventScroll: true }), 350);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const ask = async (q: string) => {
    q = q.trim();
    if (!q || loading) return;
    const next = [...msgs, { role: "user" as const, text: q }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    let text = FALLBACK;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (res.ok && typeof data.text === "string") text = data.text;
    } catch {
      // keep the fallback
    }
    setMsgs((m) => [...m, { role: "assistant", text }]);
    setLoading(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Assistant O'LDEV"
      inert={!open}
      className={`fixed bottom-[calc(clamp(14px,2.4vh,24px)+68px)] left-1/2 z-[101] flex h-[min(540px,calc(100dvh-140px))] w-[min(400px,calc(100vw-24px))] origin-bottom flex-col overflow-hidden rounded-[24px] bg-[rgba(20,18,16,.92)] text-[#F4F1EC] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8),inset_0_0_0_1px_rgba(244,241,236,.08)] backdrop-blur-[18px] transition-[translate,scale,opacity] duration-500 ease-[cubic-bezier(.32,.72,0,1)] ${
        open ? "pointer-events-auto -translate-x-1/2 translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-x-1/2 translate-y-6 scale-[.96] opacity-0"
      }`}
    >
      <div className="flex flex-none items-center gap-3 border-b border-[rgba(244,241,236,.06)] py-3.5 pl-4 pr-3.5">
        <span
          aria-hidden
          className="size-[34px] flex-none rounded-full shadow-[0_0_18px_rgba(255,59,0,.5)]"
          style={{ background: "radial-gradient(circle at 34% 28%,#FFE1CF 0%,#FF8A4C 25%,#FF3B00 55%,#5A1400 95%)" }}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[14px] font-semibold">Assistant O&apos;LDEV</span>
          <span className="text-[12px] text-[rgba(244,241,236,.5)]">Répond tout de suite · Othmane sous 48 h</span>
        </div>
        <button onClick={onClose} aria-label="Fermer" className="grid size-8 flex-none place-items-center rounded-full bg-[#1F1C19] text-[14px] transition-colors hover:bg-[#2A2622]">
          ✕
        </button>
      </div>

      <div ref={scroller} data-lenis-prevent className="flex flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap px-3.5 py-2.5 text-[14px] leading-[1.5] text-pretty ${
              m.role === "user" ? "self-end rounded-[16px_16px_4px_16px] bg-abcs-red text-white" : "self-start rounded-[16px_16px_16px_4px] bg-[#1F1C19]"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="flex gap-1 self-start rounded-[16px_16px_16px_4px] bg-[#1F1C19] px-3.5 py-3.5" aria-label="L'assistant écrit">
            {[0, 0.15, 0.3].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-[rgba(244,241,236,.5)]" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        )}
        {msgs.length === 1 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {SUGGESTS.map((t) => (
              <button key={t} onClick={() => ask(t)} className="h-8 rounded-full bg-[#1F1C19] px-3 text-[13px] transition-colors hover:bg-[#2A2622]">
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex flex-none items-center gap-2 border-t border-[rgba(244,241,236,.06)] p-2.5"
      >
        <input
          ref={field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={800}
          placeholder="Posez votre question…"
          aria-label="Votre question"
          className="h-11 min-w-0 flex-1 rounded-full bg-[#1F1C19] px-4 text-[16px] text-[#F4F1EC] outline-none placeholder:text-[rgba(244,241,236,.4)] focus-visible:ring-1 focus-visible:ring-abcs-red sm:text-[14px]"
        />
        <button type="submit" aria-label="Envoyer" disabled={loading} className="grid size-11 flex-none place-items-center rounded-full bg-abcs-red text-[16px] text-white transition-opacity disabled:opacity-50">
          ↑
        </button>
      </form>
    </div>
  );
}
