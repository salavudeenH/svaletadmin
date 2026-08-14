"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PillFilter, { PillButton } from "../_components/PillFilter";

// Doit rester identique à storageKey() dans QuestionnaireWizard.js.
function questionnaireStorageKey(reservationId, leg) {
  return `svalet_voiturier_questionnaire_${reservationId}_${leg}`;
}

function courseKey(c) {
  return `${c.reservation}_${c.leg}`;
}

const STATUT_CONFIG = {
  a_venir: { label: "À venir", badgeClass: "bg-white/20 text-white" },
  en_cours: { label: "En cours", badgeClass: "bg-amber-400 text-ink" },
  termine: { label: "Terminé", badgeClass: "bg-emerald-500 text-white" },
};

const FILTRES = [
  { key: "toutes", label: "Toutes" },
  { key: "mes_courses", label: "Mes courses" },
  { key: "a_venir", label: "À venir" },
  { key: "en_cours", label: "En cours" },
  { key: "termine", label: "Terminé" },
];

export default function CoursesList({ courses, monValetId }) {
  const router = useRouter();
  const [statuts, setStatuts] = useState({});
  const [filtre, setFiltre] = useState("toutes");

  // "En cours" = le questionnaire a été commencé (progression dans le localStorage) mais pas
  // encore terminé — seulement détectable pour MES propres courses (le localStorage d'un autre
  // voiturier n'est pas accessible depuis cet appareil).
  useEffect(() => {
    const next = {};
    for (const c of courses) {
      const estAMoi = c.valet?._id === monValetId;
      if (c.confirme_le) {
        next[courseKey(c)] = "termine";
      } else if (estAMoi && localStorage.getItem(questionnaireStorageKey(c.reservation, c.leg))) {
        next[courseKey(c)] = "en_cours";
      } else {
        next[courseKey(c)] = "a_venir";
      }
    }
    setStatuts(next);
  }, [courses, monValetId]);

  // "En cours" et "Terminé" ne concernent que mes propres courses — voir le statut d'avancement
  // des courses des collègues n'a pas de sens pour moi (et je ne peux de toute façon pas savoir
  // si une course d'un collègue est "en cours", donnée uniquement dans son propre localStorage).
  const filtered = courses.filter((c) => {
    const estAMoi = c.valet?._id === monValetId;
    const statut = statuts[courseKey(c)] || "a_venir";
    switch (filtre) {
      case "toutes":
        return true;
      case "mes_courses":
        return estAMoi;
      case "a_venir":
        return statut === "a_venir";
      case "en_cours":
        return statut === "en_cours" && estAMoi;
      case "termine":
        return statut === "termine" && estAMoi;
      default:
        return true;
    }
  });

  return (
    <>
      <PillFilter>
        {FILTRES.map((f) => (
          <PillButton key={f.key} active={filtre === f.key} onClick={() => setFiltre(f.key)}>
            {f.label}
          </PillButton>
        ))}
      </PillFilter>

      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">
            {courses.length === 0 ? "Aucune course prévue ce jour-là." : "Aucune course dans ce filtre."}
          </p>
        )}

        {filtered.map((c) => {
          const isAller = c.leg === "aller";
          const barColor = isAller ? "bg-brand" : "bg-ink";
          const statut = statuts[courseKey(c)] || "a_venir";
          const cfg = STATUT_CONFIG[statut];
          const estAMoi = c.valet?._id === monValetId;

          return (
            <div
              key={courseKey(c)}
              onClick={() => router.push(`/voiturier/courses/${c.reservation}/${c.leg}`)}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white cursor-pointer"
            >
              <div className={`${barColor} text-white px-4 py-2.5 flex items-center justify-between`}>
                <span className="font-semibold tabular-nums">{c.heure || "—"}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {isAller ? "Prise en charge" : "Restitution"}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.badgeClass}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-ink truncate">{c.client.nom || "Client SVALET"}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {c.vehicule?.marque} {c.vehicule?.modele} · {c.vehicule?.plaque}
                  </div>
                  {c.parking_nom && <div className="text-xs text-gray-400 mt-0.5">{c.parking_nom}</div>}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Voiturier</div>
                  {c.valet ? (
                    estAMoi ? (
                      <div className="text-sm font-medium text-ink">Moi</div>
                    ) : c.valet.telephone ? (
                      <a
                        href={`tel:${c.valet.telephone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-brand underline decoration-dotted"
                      >
                        {c.valet.prenom} {c.valet.nom}
                      </a>
                    ) : (
                      <div className="text-sm font-medium text-ink">
                        {c.valet.prenom} {c.valet.nom}
                      </div>
                    )
                  ) : (
                    <div className="text-sm font-medium text-gray-400 italic">Pas assigné</div>
                  )}
                </div>
              </div>
              {statut === "termine" && (
                <div className="bg-emerald-50 text-emerald-700 text-xs px-4 py-1.5">✓ Client rencontré</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
