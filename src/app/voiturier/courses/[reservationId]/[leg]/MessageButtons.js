"use client";

import { useState } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";

// "14:30" -> "14h30"
function fmtHeure(h) {
  if (!h) return "";
  return String(h).replace(":", "h");
}

function messageRestitution() {
  return [
    "Bonjour,",
    "",
    "Je suis votre voiturier Svalet. Veuillez me rappeler une fois que vous avez récupéré vos bagages ou, si vous n'avez pas de bagages, une fois que vous êtes sorti de l'avion.",
    "",
    "Cordialement,",
    "Svalet",
  ].join("\n");
}

function messagePriseEnCharge({ heure, numeroVoiturier }) {
  return [
    "Bienvenue chez SVALET !",
    "",
    `Pour votre service de voiturier à l’aéroport de Roissy CDG prévu à ${fmtHeure(heure)}`,
    "",
    `Veuillez contacter votre voiturier directement au ${numeroVoiturier}, 15 min avant votre arrivée.`,
    "",
    "Nous vous souhaitons un agréable voyage et restons à votre disposition pour toute question.",
    "",
    "www.svalet.com",
  ].join("\n");
}

function messageNumeroRestitution({ heure, numeroVoiturier }) {
  return [
    "Bienvenue chez SVALET !",
    "",
    `Pour votre service de voiturier à l’aéroport de Roissy CDG prévu à ${fmtHeure(heure)}`,
    "",
    `Veuillez contacter votre voiturier directement au ${numeroVoiturier}`,
    "",
    "Nous vous souhaitons un agréable retour et restons à votre disposition pour toute question.",
    "",
    "www.svalet.com",
  ].join("\n");
}

function smsHref(phone, body) {
  const tel = (phone || "").replace(/\s+/g, "");
  return `sms:${tel}?&body=${encodeURIComponent(body)}`;
}

function MessageButton({ label, hint, body, clientPhone, disabledReason, manager = false }) {
  const [copied, setCopied] = useState(false);

  async function copier() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible : le bouton SMS reste utilisable
    }
  }

  return (
    <div>
      <div className="flex items-stretch gap-2">
        {disabledReason ? (
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-400">
            <MessageSquare size={16} />
            <span className="font-medium">{label}</span>
          </div>
        ) : (
          <a
            href={smsHref(clientPhone, body)}
            className={`flex-1 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
              manager
                ? "border-violet-500 text-violet-700 bg-violet-50 hover:bg-violet-100"
                : "border-brand text-brand-dark bg-white hover:bg-brand-light"
            }`}
          >
            <MessageSquare size={16} />
            <span>{label}</span>
            {manager && (
              <span className="ml-auto text-[10px] uppercase tracking-wide font-bold bg-violet-600 text-white rounded-full px-2 py-0.5">
                Manager
              </span>
            )}
          </a>
        )}
        <button
          type="button"
          onClick={copier}
          disabled={Boolean(disabledReason)}
          className="w-12 shrink-0 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-brand-dark flex items-center justify-center disabled:opacity-40"
          aria-label={`Copier le message : ${label}`}
        >
          {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
        </button>
      </div>
      {(disabledReason || hint) && (
        <div className="mt-1 text-xs text-gray-400">{disabledReason || hint}</div>
      )}
    </div>
  );
}

export default function MessageButtons({ leg, heure, clientPhone, valetPhone, isManager }) {
  const isAller = leg === "aller";
  const sansClient = !clientPhone ? "Pas de numéro client" : null;
  const sansVoiturier = !valetPhone ? "Aucun numéro de voiturier assigné" : null;

  return (
    <div className="bg-white px-4 py-4 space-y-3">
      <div className="text-xs text-gray-400">Messages au client</div>

      {!isAller && (
        <MessageButton
          label="Message restitution"
          body={messageRestitution()}
          clientPhone={clientPhone}
          disabledReason={sansClient}
        />
      )}

      {isManager && isAller && (
        <MessageButton
          manager
          label="Message prise en charge (veille)"
          hint="À envoyer au client la veille"
          body={messagePriseEnCharge({ heure, numeroVoiturier: valetPhone })}
          clientPhone={clientPhone}
          disabledReason={sansClient || sansVoiturier}
        />
      )}

      {isManager && !isAller && (
        <MessageButton
          manager
          label="Message numéro du voiturier"
          hint="À envoyer au client pour la restitution"
          body={messageNumeroRestitution({ heure, numeroVoiturier: valetPhone })}
          clientPhone={clientPhone}
          disabledReason={sansClient || sansVoiturier}
        />
      )}
    </div>
  );
}
