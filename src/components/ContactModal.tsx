"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES, SERVICE_GROUPS, getBudgets, priceRange } from "@/lib/services";
import type { ContactFormData } from "@/components/ContactModalProvider";

const inputClass =
  "h-12 w-full rounded-[14px] border border-white/10 bg-[#141414] px-4 text-[16px] text-[#f4f4f2] outline-none transition-colors duration-200 placeholder:text-white/30 hover:border-white/20 focus:border-abcs-red";
const labelClass = "text-[13px] font-medium text-white/60";
const archivo = { fontFamily: "var(--font-archivo-flex), sans-serif" } as const;

const EMPTY_FORM = { name: "", email: "", phone: "", type: "", budget: "", message: "" };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ContactFormData;
}

export default function ContactModal({ isOpen, onClose, initialData }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  // Starts undefined so data passed on the first (lazy) mount is applied too
  const [prevInitialData, setPrevInitialData] = useState<ContactFormData | undefined>(undefined);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    const selectedType = initialData?.type ?? "";
    const budgets = selectedType ? getBudgets(selectedType) : [];
    const defaultBudget = initialData?.budget || (budgets.length > 0 ? budgets[0] : "");

    setForm({
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      type: selectedType,
      budget: defaultBudget,
      message: initialData?.message ?? "",
    });
    setSent(false);
  }

  const budgetOptions = form.type ? getBudgets(form.type) : [];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setError("");
      setForm({ name: "", email: "", phone: "", type: "", budget: "", message: "" });
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 right-0 top-0 z-[101] flex w-full max-w-xl flex-col overflow-y-auto overscroll-contain bg-black text-[#f4f4f2] shadow-[-30px_0_80px_rgba(0,0,0,.6)] sm:rounded-l-[28px] sm:border-l sm:border-white/10"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[.08] bg-black/90 px-[clamp(20px,5vw,40px)] py-6 backdrop-blur-[12px]">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-semibold tracking-[.14em] text-abcs-red">DÉMARRER UN PROJET</span>
                <h2 id="contact-title" className="m-0 font-semibold leading-[1.1] tracking-[-.025em]" style={{ ...archivo, fontSize: "clamp(26px,3vw,34px)" }}>
                  Parlons de votre projet<span className="text-abcs-red">.</span>
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Fermer"
                className="grid size-10 flex-none place-items-center rounded-full bg-[#1F1C19] text-[15px] transition-colors duration-200 hover:bg-abcs-red"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-[clamp(20px,5vw,40px)] py-8">
              {sent ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start gap-5 pt-6">
                  <span className="grid size-14 place-items-center rounded-full bg-abcs-red text-white">
                    <svg aria-hidden viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <h3 className="m-0 font-semibold leading-[1.1] tracking-[-.025em]" style={{ ...archivo, fontSize: "clamp(28px,3.4vw,40px)" }}>
                    Message reçu<span className="text-abcs-red">.</span>
                  </h3>
                  <p className="m-0 max-w-[420px] text-[16px] leading-[1.6] text-white/60">
                    Merci ! Je vous réponds sous 48 h maximum pour parler de votre projet en détail.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-2 inline-flex h-12 items-center gap-2.5 rounded-full border border-white/20 px-6 text-[15px] font-bold transition-colors duration-200 hover:border-abcs-red hover:bg-abcs-red"
                  >
                    Fermer <span aria-hidden>→</span>
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className={labelClass}>Nom *</span>
                      <input required name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Jean Dupont" className={inputClass} />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className={labelClass}>Email *</span>
                      <input required type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="jean@exemple.com" className={inputClass} />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className={labelClass}>Téléphone</span>
                      <input type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="06 XX XX XX XX" className={inputClass} />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className={labelClass}>Type de projet *</span>
                      <span className="relative">
                        <select
                          required
                          name="type"
                          value={form.type}
                          onChange={(e) => {
                            const newType = e.target.value;
                            const newBudgets = newType ? getBudgets(newType) : [];
                            setForm({ ...form, type: newType, budget: newBudgets[0] || "" });
                          }}
                          className={`${inputClass} appearance-none truncate pr-10 [&_optgroup]:bg-[#141414] [&_option]:bg-[#141414] ${form.type ? "" : "text-white/35"}`}
                        >
                          <option value="">Choisir…</option>
                          {SERVICE_GROUPS.map((g) => (
                            <optgroup key={g.label} label={g.label}>
                              {g.keys.map((k) => (
                                <option key={k} value={SERVICES[k].label} className="text-[#f4f4f2]">
                                  {SERVICES[k].label} — {priceRange(k)}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <svg aria-hidden viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </label>
                  </div>

                  <AnimatePresence mode="wait">
                    {form.type && budgetOptions.length > 0 && (
                      <motion.div
                        key={form.type}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        role="radiogroup"
                        aria-label="Budget"
                        className="flex flex-col gap-3"
                      >
                        <span className={labelClass}>Budget *</span>
                        <div className="flex flex-wrap gap-2">
                          {budgetOptions.map((b) => {
                            const on = form.budget === b;
                            return (
                              <button
                                key={b}
                                type="button"
                                role="radio"
                                aria-checked={on}
                                onClick={() => setForm({ ...form, budget: b })}
                                className={`h-10 rounded-full border px-4 text-[14px] font-bold transition-colors duration-150 ${
                                  on ? "border-abcs-red bg-abcs-red text-white" : "border-white/15 bg-white/[.03] text-white/80 hover:border-white/40 hover:text-white"
                                }`}
                              >
                                {b}
                              </button>
                            );
                          })}
                        </div>
                        <input type="hidden" name="budget" value={form.budget} required />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <label className="flex flex-col gap-2">
                    <span className={labelClass}>Message *</span>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez votre projet en quelques lignes…"
                      className={`${inputClass.replace("h-12 ", "")} resize-none py-3.5 leading-[1.55]`}
                    />
                  </label>

                  {error && (
                    <div role="alert" className="rounded-2xl bg-[rgba(255,59,0,.08)] px-4 py-3 text-[14px] font-semibold text-[#FF6a3d] shadow-[inset_0_0_0_1px_rgba(255,59,0,.25)]">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-abcs-red text-[15px] font-bold text-white transition-colors duration-[250ms] hover:bg-[#f4f4f2] hover:text-[#111] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        Envoi en cours
                        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      </>
                    ) : (
                      <>
                        Envoyer mon projet
                        <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                      </>
                    )}
                  </button>

                  <div className="flex flex-col gap-2.5 border-t border-white/[.08] pt-6 text-[14px]">
                    <a href="mailto:othmane.bouakline.pro@gmail.com" className="w-fit break-all text-white/70 transition-colors hover:text-abcs-red">
                      othmane.bouakline.pro@gmail.com
                    </a>
                    <a href="tel:+33660805337" className="w-fit text-white/70 transition-colors hover:text-abcs-red">
                      06 60 80 53 37
                    </a>
                    <span className="flex items-center gap-2 text-white/45">
                      <span aria-hidden className="size-1.5 rounded-full bg-abcs-green" />
                      Réponse sous 48 h · partout en France
                    </span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
