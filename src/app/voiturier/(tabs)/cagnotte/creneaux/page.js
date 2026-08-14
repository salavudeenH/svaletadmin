import { valetApiFetch } from "@/lib/valetApi";
import { fmtPrice } from "@/lib/creneaux";
import PageHeader from "../../../_components/PageHeader";

function currentMois() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function fmtMoisFR(mois) {
  const [y, m] = mois.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" });
}

export default async function VoiturierCreneauxDuMoisPage({ searchParams }) {
  const params = await searchParams;
  const mois = params?.mois || currentMois();
  const [annee, moisNum] = mois.split("-").map(Number);

  const { data: creneaux } = await valetApiFetch(`/me/creneaux?annee=${annee}&mois=${moisNum}`);

  return (
    <div>
      <PageHeader title="Créneaux effectués" subtitle={fmtMoisFR(mois)} backHref={`/voiturier/cagnotte?mois=${mois}`} />

      <div className="px-4 py-4 space-y-3">
        {creneaux.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">Aucun créneau ce mois-ci.</p>
        )}

        {creneaux.map((c) => (
          <div key={c._id} className="rounded-xl shadow-sm border border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink">
              {new Date(c.date).toLocaleDateString("fr-FR", { timeZone: "UTC", weekday: "short", day: "2-digit", month: "2-digit" })}
              {c.heure_debut && c.heure_fin && ` · ${c.heure_debut}-${c.heure_fin}`}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink">{fmtPrice(c.prix_final)}</span>
              <span
                className={`text-xs font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  c.paye ? "bg-emerald-500 text-white" : "bg-amber-400 text-ink"
                }`}
              >
                {c.paye ? "Payé" : "En attente"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
