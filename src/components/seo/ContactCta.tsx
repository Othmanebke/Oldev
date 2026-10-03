"use client";

import { useContactModal } from "@/components/ContactModalProvider";
import { SERVICES, type ServiceKey } from "@/lib/services";

/** Opens the contact modal, pre-filled with an offer when `service` is given. */
export default function ContactCta({ service, label = "Demander un devis", tone = "red" }: { service?: ServiceKey; label?: string; tone?: "red" | "light" }) {
  const { openModal } = useContactModal();
  const s = service && SERVICES[service];

  return (
    <button
      onClick={() => openModal(s ? { type: s.label, budget: s.budgets[0] } : undefined)}
      className={`inline-flex items-center gap-2.5 rounded-full px-[26px] py-[16px] text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${
        tone === "red" ? "bg-abcs-red text-white hover:bg-abcs-black" : "bg-white text-abcs-black hover:bg-abcs-red hover:text-white"
      }`}
    >
      {label} <span aria-hidden>↗</span>
    </button>
  );
}
