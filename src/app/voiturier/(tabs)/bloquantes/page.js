import Link from "next/link";
import { valetApiFetch } from "@/lib/valetApi";

function fmtDateFR(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function CoursesBloquantesPage() {
  const { data: courses } = await valetApiFetch("/me/courses-bloquantes");
  const list = courses || [];

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="font-bold text-lg text-ink">Courses bloquantes</h1>
        <p className="text-xs text-gray-400">
          Questionnaire commencé mais pas terminé — reprenez là où vous vous étiez arrêté.
        </p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {list.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">Aucune course bloquante, tout est à jour 👍</p>
        )}

        {list.map((c) => {
          const isAller = c.leg === "aller";
          const barColor = isAller ? "bg-brand" : "bg-ink";
          return (
            <Link
              key={`${c.reservation}_${c.leg}`}
              href={`/voiturier/courses/${c.reservation}/${c.leg}`}
              className="block rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white"
            >
              <div className={`${barColor} text-white px-4 py-2.5 flex items-center justify-between`}>
                <span className="font-semibold tabular-nums">
                  {fmtDateFR(c.date)} · {c.heure || "—"}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide">
                  {isAller ? "Prise en charge" : "Restitution"}
                </span>
              </div>
              <div className="px-4 py-3">
                <div className="font-medium text-ink truncate">{c.client.nom || "Client SVALET"}</div>
                <div className="text-sm text-gray-500 truncate">
                  {c.vehicule?.marque} {c.vehicule?.modele} · {c.vehicule?.plaque}
                </div>
                {c.parking_nom && <div className="text-xs text-gray-400 mt-0.5">{c.parking_nom}</div>}
              </div>
              <div className="bg-amber-50 text-amber-700 text-xs px-4 py-1.5">
                ⚠ Informations manquantes — appuyez pour continuer
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
