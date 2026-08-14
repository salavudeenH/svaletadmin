import { valetApiFetch } from "@/lib/valetApi";
import { fmtPrice } from "@/lib/creneaux";
import PageHeader from "../../_components/PageHeader";
import Pager from "../../_components/Pager";
import PillFilter, { PillLink } from "../../_components/PillFilter";

function currentMois() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function addMonths(mois, delta) {
  const [y, m] = mois.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function fmtMoisFR(mois) {
  const [y, m] = mois.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" });
}

export default async function VoiturierCreneauxPage({ searchParams }) {
  const params = await searchParams;
  const mois = params?.mois || currentMois();
  const periode = params?.periode === "passes" ? "passes" : "avenir";
  const [annee, moisNum] = mois.split("-").map(Number);
  const prevMois = addMonths(mois, -1);
  const nextMois = addMonths(mois, 1);

  const { data: tousLesCreneaux } = await valetApiFetch(`/me/creneaux?annee=${annee}&mois=${moisNum}`);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const creneaux = tousLesCreneaux
    .filter((c) => (periode === "avenir" ? new Date(c.date) >= todayStart : new Date(c.date) < todayStart))
    .sort((a, b) => (periode === "avenir" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)));

  return (
    <div>
      <PageHeader title="Mes créneaux" />

      <Pager label={fmtMoisFR(mois)} prevHref={`/voiturier/creneaux?mois=${prevMois}&periode=${periode}`} nextHref={`/voiturier/creneaux?mois=${nextMois}&periode=${periode}`} />

      <PillFilter>
        <PillLink href={`/voiturier/creneaux?mois=${mois}&periode=avenir`} active={periode === "avenir"}>
          À venir
        </PillLink>
        <PillLink href={`/voiturier/creneaux?mois=${mois}&periode=passes`} active={periode === "passes"}>
          Passés
        </PillLink>
      </PillFilter>

      <div className="px-4 py-4 space-y-3">
        {creneaux.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">
            {periode === "avenir" ? "Aucun créneau à venir ce mois-ci." : "Aucun créneau passé ce mois-ci."}
          </p>
        )}

        {creneaux.map((c) => (
          <div key={c._id} className="rounded-xl shadow-sm border border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-ink">
              {new Date(c.date).toLocaleDateString("fr-FR", { timeZone: "UTC", weekday: "short", day: "2-digit", month: "2-digit" })}
              {c.heure_debut && c.heure_fin && ` · ${c.heure_debut}-${c.heure_fin}`}
            </span>
            <span className="font-bold text-ink">{fmtPrice(c.prix_final)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
