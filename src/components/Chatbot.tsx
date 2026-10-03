"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SERVICES } from "@/lib/services";
import { useContactModal } from "@/components/ContactModalProvider";
import avatarPhoto from "@/img/avatar.webp";

type Step = {
  id: string;
  question: string;
  type?: "options" | "input";
  inputType?: string;
  options?: { label: string; value: string; nextStep?: string }[];
  nextStep?: string;
};

const CHAT_LOGIC: Record<string, Step> = {
  start: {
    id: "start",
    question: "Salut ! Je suis Othmane 👋 Prêt à concrétiser ton projet ? Quel est ton besoin principal ?",
    type: "options",
    options: [
      { label: "Créer un site web",          value: "web",      nextStep: "web_type" },
      { label: "Design & Logo (dès 50€)",    value: "branding", nextStep: "branding_type" },
      { label: "Refonte de site web",        value: "refonte",  nextStep: "refonte_type" },
      { label: "Chatbot IA & Automatisation", value: "ia",       nextStep: "budget_ia" },
    ],
  },
  web_type: {
    id: "web_type",
    question: "Super ! Quel type de site correspond à ton objectif ?",
    type: "options",
    options: [
      { label: "Site Vitrine / One-Page — 300 à 600€",  value: "vitrine",   nextStep: "budget_web_vitrine" },
      { label: "Site / App Web Sur-Mesure — 800 à 3 000€", value: "webapp",    nextStep: "budget_web_app" },
      { label: "Site WordPress Administrable — 1 200 à 2 500€", value: "wordpress", nextStep: "budget_web_wordpress" },
    ],
  },
  refonte_type: {
    id: "refonte_type",
    question: "Pour ta refonte, ton site actuel est plutôt sur WordPress ou codé sur-mesure ?",
    type: "options",
    options: [
      { label: "Site sur WordPress",       value: "refonte_wp",   nextStep: "budget_refonte" },
      { label: "Site codé / Autre CMS",    value: "refonte_code", nextStep: "budget_refonte" },
    ],
  },
  budget_web_vitrine:   { id: "budget_web_vitrine",   question: "Site Vitrine (300 à 600€ selon les options) — quelle est ta fourchette de budget ?", type: "options", options: SERVICES.vitrine.budgets.map(b => ({ label: b, value: b, nextStep: "ask_name" })) },
  budget_web_app:       { id: "budget_web_app",       question: "Site & App sur-mesure (800 à 3 000€ selon les options) — ton budget estimé ?",         type: "options", options: SERVICES.webapp.budgets.map(b => ({ label: b, value: b, nextStep: "ask_name" })) },
  budget_web_wordpress: { id: "budget_web_wordpress", question: "WordPress (1 200 à 2 500€ selon les options) — quelle fourchette de budget ?",        type: "options", options: SERVICES.wordpress.budgets.map(b => ({ label: b, value: b, nextStep: "ask_name" })) },
  budget_refonte:       { id: "budget_refonte",       question: "Refonte sur devis — quel budget souhaites-tu allouer ?",        type: "options", options: SERVICES.refonte.budgets.map(b => ({ label: b, value: b, nextStep: "ask_name" })) },
  budget_ia:            { id: "budget_ia",            question: "Chatbot IA & Automatisation — ton budget envisagé ?",           type: "options", options: SERVICES.chatbot_ia.budgets.map(b => ({ label: b, value: b, nextStep: "ask_name" })) },
  branding_type: {
    id: "branding_type",
    question: "Design graphique — quel format souhaites-tu ?",
    type: "options",
    options: [
      { label: "Flyer & Logo Canva Express — dès 50€",  value: "branding_canva", nextStep: "ask_name" },
      { label: "Pack Identité Visuelle Adobe CC — dès 100€", value: "branding_adobe", nextStep: "ask_name" },
    ],
  },
  ask_name:  { id: "ask_name",  question: "C'est quoi ton prénom ou le nom de ton entreprise ?", type: "input", inputType: "text",  nextStep: "ask_email" },
  ask_email: { id: "ask_email", question: "Enchanté [NAME] ! Ton adresse email pour ma réponse ?", type: "input", inputType: "email", nextStep: "ask_phone" },
  ask_phone: { id: "ask_phone", question: "Un numéro pour qu'on puisse en discuter si besoin ?", type: "input", inputType: "tel",   nextStep: "finish"    },
};


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ isOpen, onClose }: Props) {
  const { openModal } = useContactModal();
  const [currentStepId, setCurrentStepId] = useState("start");
  const [history, setHistory] = useState<{ type: "bot" | "user"; text: string }[]>([
    { type: "bot", text: CHAT_LOGIC.start.question },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen && done) {
      setDone(false);
      setCurrentStepId("start");
      setHistory([{ type: "bot", text: CHAT_LOGIC.start.question }]);
      setAnswers({});
      setInputValue("");
    }
  }


  const handleOptionClick = (opt: { label: string; value: string; nextStep?: string }) => {
    setAnswers((prev) => ({ ...prev, [currentStepId]: opt.value }));
    setHistory((prev) => [...prev, { type: "user", text: opt.label }]);
    if (opt.nextStep) next(opt.nextStep);
  };

  const next = (nextId: string, name?: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCurrentStepId(nextId);
      let q = CHAT_LOGIC[nextId].question;
      if (name) q = q.replace("[NAME]", name);
      setHistory((prev) => [...prev, { type: "bot", text: q }]);
    }, 700);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const val = inputValue.trim();
    if (!val) return;

    if (currentStepId === "ask_email") {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!valid) { setError("Email invalide."); return; }
    }

    const newAnswers = { ...answers, [currentStepId]: val };
    setAnswers(newAnswers);
    setHistory((prev) => [...prev, { type: "user", text: val }]);
    setInputValue("");

    const step = CHAT_LOGIC[currentStepId];
    if (step.nextStep === "finish") {
      finish(newAnswers);
    } else if (step.nextStep) {
      next(step.nextStep, currentStepId === "ask_name" ? val : (answers.ask_name || ""));
    }
  };

  const finish = (finalAnswers: Record<string, string>) => {
    setDone(true);
    setHistory((prev) => [
      ...prev,
      { type: "bot", text: "Parfait ! Je prépare ton formulaire avec tout pré-rempli... 🚀" },
    ]);

    const serviceKey = (
      finalAnswers.web_type ||
      finalAnswers.branding_type ||
      (finalAnswers.start === "refonte" ? "refonte" : undefined) ||
      (finalAnswers.start === "ia" ? "chatbot_ia" : undefined)
    ) as keyof typeof SERVICES | undefined;
    const serviceLabel = serviceKey && SERVICES[serviceKey] ? SERVICES[serviceKey].label : "";
    const budget = Object.entries(finalAnswers).find(([k]) => k.startsWith("budget_"))?.[1] || "";


    setTimeout(() => {
      // Ferme le chat, ouvre la modal avec les données collectées
      onClose();
      openModal({
        name:    finalAnswers.ask_name  || "",
        email:   finalAnswers.ask_email || "",
        phone:   finalAnswers.ask_phone || "",
        type:    serviceLabel,
        budget,
        message: "",
      });
      // Reset le chat pour la prochaine ouverture
      setTimeout(() => {
        setDone(false);
        setCurrentStepId("start");
        setHistory([{ type: "bot", text: CHAT_LOGIC.start.question }]);
        setAnswers({});
        setInputValue("");
      }, 500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat"
          initial={{ opacity: 0, y: 16, scale: 0.96, transformOrigin: "bottom left" }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-full left-0 mb-3 z-50 w-[340px] md:w-[380px] flex flex-col rounded-3xl rounded-bl-xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-white/10"
          style={{ height: "480px", background: "rgba(12,12,12,0.96)", backdropFilter: "blur(24px)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#222] flex-shrink-0">
                <Image src={avatarPhoto} alt="Othmane" fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="font-heading text-sm uppercase text-white/90 leading-none tracking-wide">Othmane</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-[12px] uppercase tracking-widest text-emerald-400/70">En ligne</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all text-sm font-bold">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth" style={{ scrollbarWidth: "none" }}>
            {history.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`max-w-[82%] px-4 py-3 text-sm font-bold leading-relaxed ${
                  msg.type === "bot"
                    ? "self-start rounded-2xl rounded-tl-sm text-white/80 border border-white/8"
                    : "self-end rounded-2xl rounded-tr-sm text-white"
                }`}
                style={{
                  background: msg.type === "bot"
                    ? "rgba(255,255,255,0.07)"
                    : "#FF3B00",
                }}
              >
                {msg.text}
              </motion.div>
            ))}

            {isTyping && (
              <div className="self-start px-4 py-3 rounded-2xl rounded-tl-sm border border-white/8 flex gap-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                {[0, 0.12, 0.24].map((d, j) => (
                  <div key={j} className="w-1.5 h-1.5 rounded-full bg-abcs-red animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="px-4 pb-4 pt-3 flex-shrink-0 border-t border-white/8 flex flex-col gap-2.5" style={{ background: "rgba(0,0,0,0.3)" }}>
            {error && <p className="text-[12px] font-bold text-abcs-red uppercase tracking-widest">{error}</p>}

            {CHAT_LOGIC[currentStepId]?.type === "input" ? (
              <form onSubmit={handleInputSubmit} className="flex gap-2">
                <input
                  autoFocus
                  type={CHAT_LOGIC[currentStepId].inputType}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tape ici..."
                  className="flex-1 rounded-full px-4 py-2.5 font-bold text-sm text-white/80 outline-none placeholder:text-white/20 border border-white/10 focus:border-abcs-red/50 transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-abcs-red flex items-center justify-center text-white font-bold text-base hover:opacity-80 transition-opacity flex-shrink-0"
                >
                  ↗
                </button>
              </form>
            ) : (
              !done && (
                <div className="flex flex-wrap gap-2">
                  {CHAT_LOGIC[currentStepId]?.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionClick(opt)}
                      className="px-3.5 py-2 rounded-full font-bold text-[12px] uppercase tracking-wider border border-white/12 text-white/55 hover:bg-abcs-red hover:text-white hover:border-abcs-red transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
