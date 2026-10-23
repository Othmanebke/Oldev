"use client";

import { useEffect, useRef, useState } from "react";
import { useContactModal } from "@/components/ContactModalProvider";
import { EMAIL } from "@/lib/site";
import { SERVICES, type ServiceKey } from "@/lib/services";

/** `form`: the contact form offered under an answer (a service, or "" for an empty form). */
type Msg = { role: "user" | "assistant"; text: string; form?: ServiceKey | "" | null };

const GREETING: Msg = { role: "assistant", text: "Bonjour ! Je suis l'assistant d'Othmane. Une question sur un site, un prix ou un délai ? Ou choisissez directement votre projet." };
const SUGGESTS = ["Combien coûte un site vitrine ?", "Quels sont les délais ?", "Tu fais du WordPress ?"];
const PROJECTS: { key: ServiceKey; label: string }[] = [
  { key: "vitrine", label: "Site vitrine" },
  { key: "webapp", label: "Site sur-mesure" },
  { key: "wordpress", label: "WordPress" },
  { key: "refonte", label: "Refonte" },
  { key: "branding_canva", label: "Logo & flyer" },
  { key: "chatbot_ia", label: "Chatbot IA" },
];
const FALLBACK: Msg = { role: "assistant", text: `Je n'arrive pas à répondre pour l'instant. Écrivez à ${EMAIL} : réponse sous 48 h, ou remplissez le formulaire.`, form: "" };

const chip = "h-8 rounded-full bg-[#1F1C19] px-3 text-[13px] transition-colors hover:bg-[#2A2622]";

/** AI assistant panel, above the bottom bar (answers from /api/chat). Every path leads to the pre-filled contact form. */
export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openModal } = useContactModal();
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

  /** Closes the chat and opens the contact form, with the service and its budget range when known. */
  const toForm = (key?: ServiceKey | "") => {
    onClose();
    const s = key ? SERVICES[key] : undefined;
    openModal(s ? { type: s.label, budget: s.budgets[0] } : undefined);
  };

  const ask = async (q: string) => {
    q = q.trim();
    if (!q || loading) return;
    const next = [...msgs, { role: "user" as const, text: q }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    let reply = FALLBACK;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, text }) => ({ role, text })) }),
      });
      const data = await res.json();
      if (res.ok && typeof data.text === "string") reply = { role: "assistant", text: data.text, form: data.form ?? null };
    } catch {
      // keep the fallback
    }
    setMsgs((m) => [...m, reply]);
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
          <span className="truncate text-[12px] text-[rgba(244,241,236,.5)]">Répond tout de suite · Othmane sous 48 h</span>
        </div>
        <button onClick={() => toForm()} className="h-8 flex-none rounded-full bg-[#F4F1EC] px-3 text-[12px] font-semibold text-[#0A0908] transition-colors hover:bg-abcs-red hover:text-white">
          Formulaire
        </button>
        <button onClick={onClose} aria-label="Fermer" className="grid size-8 flex-none place-items-center rounded-full bg-[#1F1C19] text-[14px] transition-colors hover:bg-[#2A2622]">
          ✕
        </button>
      </div>

      <div ref={scroller} data-lenis-prevent className="flex flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain p-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`flex max-w-[85%] flex-col gap-2 ${m.role === "user" ? "self-end" : "self-start"}`}>
            <div
              className={`whitespace-pre-wrap px-3.5 py-2.5 text-[14px] leading-[1.5] text-pretty ${
                m.role === "user" ? "rounded-[16px_16px_4px_16px] bg-abcs-red text-white" : "rounded-[16px_16px_16px_4px] bg-[#1F1C19]"
              }`}
            >
              {m.text}
            </div>
            {m.form != null && (
              <button
                onClick={() => toForm(m.form ?? "")}
                className="self-start rounded-full bg-abcs-red px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#F4F1EC] hover:text-[#0A0908]"
              >
                {m.form ? `Remplir le formulaire · ${PROJECTS.find((p) => p.key === m.form)?.label ?? "devis"}` : "Ouvrir le formulaire"} ↗
              </button>
            )}
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
          <>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {SUGGESTS.map((t) => (
                <button key={t} onClick={() => ask(t)} className={chip}>
                  {t}
                </button>
              ))}
            </div>
            <span className="mt-2 text-[12px] font-semibold uppercase tracking-[.12em] text-[rgba(244,241,236,.45)]">Démarrer un projet</span>
            <div className="flex flex-wrap gap-1.5">
              {PROJECTS.map((p) => (
                <button key={p.key} onClick={() => toForm(p.key)} className={`${chip} hover:!bg-abcs-red hover:text-white`}>
                  {p.label} ↗
                </button>
              ))}
            </div>
          </>
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
