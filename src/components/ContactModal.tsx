"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES, SERVICE_GROUPS, getBudgets, priceRange } from "@/lib/services";
import type { ContactFormData } from "@/components/ContactModalProvider";

const inputClass =
  "w-full bg-transparent border-b-2 border-black/20 focus:border-abcs-red py-3 font-bold text-base placeholder:opacity-30 placeholder:font-bold outline-none transition-colors duration-200";

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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-xl bg-[#f0f0ee] overflow-y-auto flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-black/10 sticky top-0 bg-[#f0f0ee] z-10">
              <div>
                <p className="font-bold text-[12px] uppercase tracking-[0.2em] opacity-40 mb-1">Démarrer un projet</p>
                <h2 className="font-heading text-3xl uppercase leading-none">Contact</h2>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center border border-black/20 hover:border-abcs-red hover:text-abcs-red transition-colors font-bold text-xl"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 py-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6 pt-8"
                >
                  <div className="font-heading text-abcs-red text-7xl uppercase leading-none">Reçu !</div>
                  <h3 className="font-heading text-3xl uppercase">Merci pour ton message</h3>
                  <p className="font-bold opacity-60 leading-relaxed">
                    Je te réponds sous 48h maximum pour discuter de ton projet en détail.
                  </p>
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center gap-3 border border-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-abcs-black hover:text-white transition-colors mt-4 group w-fit"
                  >
                    <span>Fermer</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-[12px] uppercase tracking-widest opacity-40">Nom *</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Jean Dupont" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-[12px] uppercase tracking-widest opacity-40">Email *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="jean@exemple.com" className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-[12px] uppercase tracking-widest opacity-40">Téléphone</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="06 XX XX XX XX" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-[12px] uppercase tracking-widest opacity-40">Type de projet *</label>
                      <select
                        required
                        name="type"
                        value={form.type}
                        onChange={(e) => {
                          const newType = e.target.value;
                          const newBudgets = newType ? getBudgets(newType) : [];
                          setForm({ ...form, type: newType, budget: newBudgets[0] || "" });
                        }}
                        className={`${inputClass} appearance-none`}
                      >

                        <option value="">Choisir...</option>
                        {SERVICE_GROUPS.map((g) => (
                          <optgroup key={g.label} label={g.label}>
                            {g.keys.map((k) => (
                              <option key={k} value={SERVICES[k].label}>
                                {SERVICES[k].label} — {priceRange(k)}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {form.type && budgetOptions.length > 0 && (
                      <motion.div
                        key={form.type}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-3"
                      >
                        <label className="font-bold text-[12px] uppercase tracking-widest opacity-40">Budget *</label>
                        <div className="flex flex-wrap gap-2">
                          {budgetOptions.map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setForm({ ...form, budget: b })}
                              className={`px-4 py-2 font-bold text-sm border-2 transition-all duration-150 ${
                                form.budget === b
                                  ? "bg-abcs-black text-white border-abcs-black"
                                  : "bg-transparent border-black/20 hover:border-abcs-black"
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" name="budget" value={form.budget} required />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[12px] uppercase tracking-widest opacity-40">Message *</label>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Décris ton projet en quelques lignes..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {error && (
                    <div className="text-abcs-red font-bold text-sm border border-abcs-red/30 bg-abcs-red/5 px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-abcs-black text-white py-5 font-bold text-sm uppercase tracking-widest hover:bg-abcs-red transition-colors duration-300 flex items-center justify-center gap-4 group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span>Envoi en cours</span>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Envoyer mon projet</span>
                        <span className="text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                      </>
                    )}
                  </button>

                  <div className="flex flex-col gap-3 border-t border-black/10 pt-6">
                    <a href="mailto:othmane.bouakline.pro@gmail.com" className="font-bold text-sm hover:text-abcs-red transition-colors break-all">
                      othmane.bouakline.pro@gmail.com
                    </a>
                    <a href="tel:+33660805337" className="font-bold text-sm hover:text-abcs-red transition-colors">
                      06 60 80 53 37
                    </a>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="font-bold text-[12px] uppercase tracking-widest opacity-40">Disponible · France & remote</span>
                    </div>
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
