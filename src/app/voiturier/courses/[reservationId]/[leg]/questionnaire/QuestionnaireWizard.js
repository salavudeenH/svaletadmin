"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepRenderer from "./StepRenderer";

function fmtDateFR(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function storageKey(reservationId, leg) {
  return `svalet_voiturier_questionnaire_${reservationId}_${leg}`;
}

function buildSteps(leg, course, answers) {
  if (leg === "retour") {
    return [
      {
        type: "number",
        key: "kilometrage_retour",
        question: "Quel est le kilométrage du véhicule ?",
        label: "Kilomètres",
        hint: course.kilometrage_depot != null ? `Au dépôt : ${course.kilometrage_depot} km` : null,
      },
      {
        type: "yesno",
        key: "incident_signale",
        question: "Y a-t-il un incident à signaler sur le véhicule ?",
      },
      ...(answers.incident_signale
        ? [
            {
              type: "textarea",
              key: "incident_description",
              question: "Décrivez l'incident constaté",
            },
          ]
        : []),
      {
        type: "signature",
        key: "signature_retour",
        consent:
          "En signant, j'accepte les CGV sans réserve et je reconnais avoir récupéré mon véhicule dans l'état auquel je l'ai déposé, sauf si un rapport d'incident a été créé par mon voiturier à l'étape précédente.",
      },
    ];
  }

  const rp = course.retour_prevu || {};
  return [
    {
      type: "yesno",
      key: "retour_confirme_par_client",
      question: `Revenez-vous bien le ${fmtDateFR(rp.date_retour)} ?`,
    },
    ...(answers.retour_confirme_par_client === false
      ? [
          {
            type: "date",
            key: "date_retour_annoncee",
            question: "À quelle date le client revient-il ?",
          },
        ]
      : []),
    {
      type: "time",
      key: "heure_retour",
      question: "À quelle heure arrivera votre vol de retour ?",
      initial: rp.heure_retour || "",
    },
    {
      type: "text",
      key: "numero_vol_retour",
      question: "Votre numéro de vol est-il le bon ?",
      label: "N°",
      initial: rp.numero_vol_retour || "",
    },
    {
      type: "text2",
      keys: ["vol_retour_ville_depart", "vol_retour_compagnie"],
      labels: ["Ville", "Compagnie aérienne"],
      question: "D'où décollera votre avion au retour ?",
      initials: [rp.ville_depart || "", rp.compagnie || ""],
    },
    {
      type: "yesno",
      key: "sky_priority",
      question: "Êtes-vous adhérent au service Sky Priority ?",
    },
    {
      type: "yesno",
      key: "bagages_soute",
      question: "Aurez-vous des bagages en soute au retour ?",
    },
    {
      type: "photos",
      key: "photos_prise_en_charge",
      photoType: "prise_en_charge",
      question: "Prenez plusieurs photos du véhicule au dépose-minute",
    },
    {
      type: "signature",
      key: "signature_depot",
      consent:
        "En signant, j'accepte les CGV sans réserve et je reconnais confier mon véhicule à SVALET jusqu'à mon retour de voyage et autorise mon voiturier à le conduire et à le stationner.",
    },
    {
      type: "number",
      key: "kilometrage_depot",
      question: "Quel est le kilométrage du véhicule ?",
      label: "Kilomètres",
    },
    {
      type: "parking",
      keys: ["parking_nom", "numero_cle"],
      question: "Où avez-vous garé le véhicule ?",
      initials: [course.parking_nom || "", course.numero_cle || ""],
    },
    {
      type: "photos",
      key: "photos_voiture_garee",
      photoType: "voiture_garee",
      question: "Prenez une photo du véhicule garé",
    },
    {
      type: "photos",
      key: "photos_cle_coffre",
      photoType: "cle_coffre",
      question: "Prenez une photo du dépôt de la clé au coffre",
    },
  ];
}

function initialAnswersFromCourse(leg, course) {
  const init = {};
  for (const s of buildSteps(leg, course, {})) {
    if (s.type === "text2" || s.type === "parking") {
      s.keys.forEach((k, i) => (init[k] = s.initials[i]));
    } else if (s.initial !== undefined) {
      init[s.key] = s.initial;
    }
  }
  return init;
}

function readSavedProgress(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

export default function QuestionnaireWizard({ reservationId, leg, course, parkings = [] }) {
  const router = useRouter();
  const key = storageKey(reservationId, leg);

  // Hydratation synchrone (dans les initialiseurs, pas un useEffect après coup) : évite toute
  // course entre "lire la progression sauvegardée" et "l'écraser avec l'état initial vide", qui
  // faisait perdre l'étape sauvegardée dès qu'une étape conditionnelle (ex: nouvelle date annoncée)
  // changeait le nombre total d'étapes entre deux ouvertures du questionnaire.
  const [answers, setAnswers] = useState(() => {
    const init = initialAnswersFromCourse(leg, course);
    const saved = readSavedProgress(key);
    return saved?.answers ? { ...init, ...saved.answers } : init;
  });
  const [stepIndex, setStepIndex] = useState(() => {
    const saved = readSavedProgress(key);
    if (!saved) return 0;
    const mergedAnswers = { ...initialAnswersFromCourse(leg, course), ...saved.answers };
    const restoredSteps = buildSteps(leg, course, mergedAnswers);
    return Math.min(saved.stepIndex || 0, restoredSteps.length - 1);
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState(null);

  const steps = buildSteps(leg, course, answers);

  // Persistance à chaque changement, pour reprendre exactement à la même étape en cas de sortie.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ stepIndex, answers }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, answers]);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  function setAnswer(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed() {
    if (step.type === "signature") return Boolean(answers[step.key]);
    if (step.type === "yesno") return answers[step.key] !== undefined;
    if (step.type === "parking") return Boolean(answers[step.keys[0]]) && Boolean(answers[step.keys[1]]);
    if (step.type === "textarea") return Boolean(answers[step.key]?.trim());
    return true;
  }

  async function goNext() {
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/voiturier/courses/${reservationId}/${leg}/confirmer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Erreur lors de l'enregistrement");
      localStorage.removeItem(key);
      router.push(`/voiturier/courses/${reservationId}/${leg}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  function goBack() {
    if (stepIndex === 0) {
      router.back();
      return;
    }
    setStepIndex((i) => i - 1);
  }

  function selectYesNo(value) {
    setAnswer(step.key, value);
    if (!isLast) setStepIndex((i) => i + 1);
  }

  return (
    <div
      className="min-h-screen bg-brand flex flex-col px-6 pb-6"
      style={{ paddingTop: "max(2.5rem, env(safe-area-inset-top))", paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-white text-xs">
          Client : <span className="font-semibold">{course.client.nom}</span>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/voiturier/courses/${reservationId}/${leg}`)}
          className="text-white/90 text-2xl leading-none px-2 -mr-2"
          aria-label="Fermer le questionnaire"
        >
          ✕
        </button>
      </div>
      <div className="text-white/80 text-xs mb-8">
        De : <span className="font-semibold text-white">Roissy CDG</span> à Parking
      </div>

      <StepRenderer
        step={step}
        answers={answers}
        setAnswer={setAnswer}
        parkings={parkings}
        reservationId={reservationId}
        leg={leg}
        uploadingPhotos={uploadingPhotos}
        setUploadingPhotos={setUploadingPhotos}
        selectYesNo={selectYesNo}
      />

      {error && <p className="text-white bg-black/20 rounded-lg px-3 py-2 mt-4 text-sm">{error}</p>}

      <div className="flex-1" />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center text-xl"
        >
          ←
        </button>
        <span className="text-white/70 text-sm font-medium">
          {stepIndex + 1} / {steps.length}
        </span>
        {step.type !== "yesno" && (
          <button
            type="button"
            disabled={!canProceed() || submitting || uploadingPhotos}
            onClick={goNext}
            className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center text-xl disabled:opacity-40"
          >
            {submitting ? "…" : "→"}
          </button>
        )}
        {step.type === "yesno" && <div className="w-12 h-12" />}
      </div>
    </div>
  );
}
