import Link from "next/link";
import { valetApiFetch } from "@/lib/valetApi";
import { fmtPrice } from "@/lib/creneaux";
import PageHeader from "../../_components/PageHeader";
import Pager from "../../_components/Pager";

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

export default async function VoiturierCagnottePage({ searchParams }) {
  const params = await searchParams;
  const mois = params?.mois || currentMois();
  const [annee, moisNum] = mois.split("-").map(Number);
  const prevMois = addMonths(mois, -1);
  const nextMois = addMonths(mois, 1);

  const { data: cagnotte } = await valetApiFetch(`/me/cagnotte?annee=${annee}&mois=${moisNum}`);
  const entierementPaye = cagnotte.total > 0 && cagnotte.restant === 0;

  return (
    <div>
      <PageHeader title="Cagnotte" />

      <Pager label={fmtMoisFR(mois)} prevHref={`/voiturier/cagnotte?mois=${prevMois}`} nextHref={`/voiturier/cagnotte?mois=${nextMois}`} />

      <div className="px-4 py-6">
        <Link
          href={cagnotte.nb_creneaux > 0 ? `/voiturier/cagnotte/creneaux?mois=${mois}` : "#"}
          className={`block rounded-2xl bg-ink text-white p-6 text-center shadow-sm ${
            cagnotte.nb_creneaux > 0 ? "active:opacity-80" : "pointer-events-none"
          }`}
        >
          <p className="text-xs uppercase tracking-wide text-white/60 mb-2">Total gagné</p>
          <p className="text-4xl font-bold">{fmtPrice(cagnotte.total)}</p>
          <p className="text-xs text-white/50 mt-2">
            {cagnotte.nb_creneaux} créneau(x){cagnotte.nb_creneaux > 0 && " · voir le détail →"}
          </p>
        </Link>

        {cagnotte.total > 0 && (
          <div className="mt-4 space-y-2">
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Payé</span>
              <span className="font-semibold text-emerald-600">{fmtPrice(cagnotte.paye)}</span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">En attente</span>
              <span className="font-semibold text-amber-600">{fmtPrice(cagnotte.restant)}</span>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <span
            className={`inline-block text-xs font-medium uppercase tracking-wide px-3 py-1.5 rounded-full ${
              cagnotte.total === 0
                ? "bg-gray-100 text-gray-400"
                : entierementPaye
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {cagnotte.total === 0 ? "Aucun créneau ce mois-ci" : entierementPaye ? "Tout est payé" : "Paiement en attente"}
          </span>
        </div>
      </div>
    </div>
  );
}
