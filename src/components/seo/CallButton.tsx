"use client";

import { useContactModal } from "@/components/ContactModalProvider";
import { SERVICES, type ServiceKey } from "@/lib/services";

/** Opens the contact modal, pre-filled with an offer when `service` is given. */
export default function CallButton({ label, className, service }: { label: string; className: string; service?: ServiceKey }) {
  const { openModal } = useContactModal();
  const s = service && SERVICES[service];

  return (
    <button onClick={() => openModal(s ? { type: s.label, budget: s.budgets[0] } : undefined)} className={className}>
      {label}
    </button>
  );
}
