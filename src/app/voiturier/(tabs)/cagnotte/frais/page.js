import Link from "next/link";
import { valetApiFetch } from "@/lib/valetApi";
import { fmtPrice } from "@/lib/creneaux";
import PageHeader from "../../../_components/PageHeader";
import SupprimerFraisButton from "./SupprimerFraisButton";

function currentMois() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function fmtMoisFR(mois) {
  const [y, m] = mois.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" });
}

const STATUTS = {
  en_attente: { label: "En attente", cls: "bg-amber-50 text-amber-700" },
  accepte: { label: "Accepté", cls: "bg-emerald-50 text-emerald-700" },
  refuse: { label: "Refusé", cls: "bg-red-50 text-red-700" },
};

export default async function VoiturierFraisPage({ searchParams }) {
  const params = await searchParams;
  const mois = params?.mois || currentMois();
  const [annee, moisNum] = mois.split("-").map(Number);
  const { data: frais } = await valetApiFetch(`/me/frais?annee=${annee}&mois=${moisNum}`);

  return (
    <div>
      <PageHeader title="Mes frais" subtitle={fmtMoisFR(mois)} backHref={`/voiturier/cagnotte?mois=${mois}`} />

      <div className="px-4 py-4 space-y-3">
        <Link
          href={`/voiturier/cagnotte/frais/new?mois=${mois}`}
          className="block w-full bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl px-4 py-3.5 text-center"
        >
          + Ajouter un frais
        </Link>

        {frais.length === 0 && <p className="text-center text-sm text-gray-400 mt-8">Aucun frais ce mois-ci.</p>}

        {frais.map((f) => {
          const s = STATUTS[f.statut];
          return (
            <div key={f._id} className="rounded-xl shadow-sm border border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
              {f.photo_url && (
                <a href={f.photo_url} target="_blank" rel="noreferrer" className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.photo_url} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
                </a>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-medium text-ink truncate">{f.libelle}</div>
                <div className="text-xs text-gray-400">
                  {new Date(f.date).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" })}
                </div>
                {f.statut === "refuse" && f.refus_motif && <div className="text-xs text-red-500">{f.refus_motif}</div>}
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-ink">{fmtPrice(f.montant)}</div>
                <span className={`inline-block text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                {f.statut === "en_attente" && (
                  <div className="mt-1">
                    <SupprimerFraisButton id={f._id} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
