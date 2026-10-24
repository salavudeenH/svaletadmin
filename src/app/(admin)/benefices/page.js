import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { fmtPrice } from "@/lib/creneaux";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import LigneForm from "./LigneForm";
import { SupprimerLigneButton, ExclureValetButton } from "./BoutonsLigne";

const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function periodeVoisine(annee, mois, delta) {
  const d = new Date(Date.UTC(annee, mois - 1 + delta, 1));
  return { annee: d.getUTCFullYear(), mois: d.getUTCMonth() + 1 };
}

function Montant({ value, signe = false }) {
  const couleur = value < 0 ? "text-red-600" : "text-ink";
  return <span className={couleur}>{signe && value > 0 ? "+" : ""}{fmtPrice(value)}</span>;
}

function Bloc({ titre, total, children }) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="font-semibold text-ink">{titre}</h2>
        <span className="font-semibold text-ink">{fmtPrice(total)}</span>
      </div>
      {children}
    </Card>
  );
}

function Ligne({ ligne }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-t border-gray-50 text-sm">
      <span className="flex-1 min-w-0 truncate">{ligne.libelle}</span>
      <span className="font-medium whitespace-nowrap">{fmtPrice(ligne.montant)}</span>
      <SupprimerLigneButton id={ligne._id} libelle={ligne.libelle} />
    </div>
  );
}

export default async function BeneficesPage({ searchParams }) {
  const params = await searchParams;
  const now = new Date();
  const annee = parseInt(params?.annee, 10) || now.getUTCFullYear();
  const moisParam = parseInt(params?.mois, 10);
  const mois = moisParam >= 1 && moisParam <= 12 ? moisParam : now.getUTCMonth() + 1;

  const [{ data }, { data: apercu }] = await Promise.all([
    apiFetch(`/admin/benefices?annee=${annee}&mois=${mois}`),
    apiFetch(`/admin/benefices/annee?annee=${annee}`),
  ]);

  const prec = periodeVoisine(annee, mois, -1);
  const suiv = periodeVoisine(annee, mois, 1);
  const { revenus, couts } = data;

  return (
    <div>
      <PageHeader
        title="Bénéfices par mois"
        description="Revenus du mois (réservations + autres plateformes) moins les coûts (voituriers + dépenses)."
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/benefices?annee=${prec.annee}&mois=${prec.mois}`} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">←</Link>
            <span className="min-w-36 text-center font-semibold text-ink">{MOIS[mois - 1]} {annee}</span>
            <Link href={`/benefices?annee=${suiv.annee}&mois=${suiv.mois}`} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">→</Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5">
          <p className="text-sm text-gray-500">Revenus</p>
          <p className="text-2xl sm:text-3xl font-bold text-ink mt-1">{fmtPrice(revenus.total)}</p>
        </div>
        <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5">
          <p className="text-sm text-gray-500">Coûts</p>
          <p className="text-2xl sm:text-3xl font-bold text-ink mt-1">{fmtPrice(couts.total)}</p>
        </div>
        <div className={`rounded-card border p-4 sm:p-5 ${data.benefice < 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
          <p className="text-sm text-gray-600">Bénéfice du mois</p>
          <p className={`text-2xl sm:text-3xl font-bold mt-1 ${data.benefice < 0 ? "text-red-700" : "text-emerald-700"}`}>
            {fmtPrice(data.benefice)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* REVENUS */}
        <div className="space-y-4">
          <Bloc titre="Réservations SVALET" total={revenus.reservations.total}>
            <p className="px-4 py-3 text-sm text-gray-500">
              {revenus.reservations.nombre} réservation(s) avec prise en charge en {MOIS[mois - 1].toLowerCase()} — montant réellement payé.
            </p>
          </Bloc>

          <Bloc titre="Autres plateformes" total={revenus.total_externes}>
            {revenus.externes.length === 0 ? (
              <EmptyState>Aucun revenu d'une autre plateforme ce mois-ci.</EmptyState>
            ) : (
              revenus.externes.map((l) => <Ligne key={l._id} ligne={l} />)
            )}
            <LigneForm type="revenu_externe" annee={annee} mois={mois} placeholder="Plateforme (ex. Parkos)" bouton="Ajouter" />
          </Bloc>
        </div>

        {/* COÛTS */}
        <div className="space-y-4">
          <Bloc titre="Voituriers (créneaux + frais)" total={couts.total_voituriers}>
            {couts.voituriers.length === 0 ? (
              <EmptyState>Aucun créneau ce mois-ci.</EmptyState>
            ) : (
              <div className="divide-y divide-gray-50">
                {couts.voituriers.map((v) => (
                  <div key={v.valet._id} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${v.exclu ? "bg-gray-50" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <div className={`truncate ${v.exclu ? "text-gray-400 line-through" : "font-medium"}`}>
                        {v.valet.prenom} {v.valet.nom}
                      </div>
                      <div className="text-xs text-gray-400">
                        Créneaux {fmtPrice(v.creneaux)}{v.frais > 0 && <> · Frais {fmtPrice(v.frais)}</>}
                        {v.exclu && <> · non compté dans le bénéfice</>}
                      </div>
                    </div>
                    <span className={`font-medium whitespace-nowrap ${v.exclu ? "text-gray-400" : ""}`}>{fmtPrice(v.total)}</span>
                    <ExclureValetButton id={v.valet._id} exclu={v.exclu} />
                  </div>
                ))}
              </div>
            )}
            {couts.total_voituriers_exclus > 0 && (
              <p className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
                {fmtPrice(couts.total_voituriers_exclus)} non déduits (voituriers ignorés).
              </p>
            )}
          </Bloc>

          <Bloc titre="Autres dépenses" total={couts.total_depenses}>
            {couts.depenses.length === 0 ? (
              <EmptyState>Aucune dépense saisie ce mois-ci.</EmptyState>
            ) : (
              couts.depenses.map((l) => <Ligne key={l._id} ligne={l} />)
            )}
            <LigneForm type="depense" annee={annee} mois={mois} placeholder="Dépense (ex. assurance, publicité)" bouton="Ajouter" />
          </Bloc>
        </div>
      </div>

      {/* VUE ANNÉE */}
      <h2 className="font-semibold text-ink mb-3">Vue {annee}</h2>
      <Card padded={false} className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Mois</th>
              <th className="px-4 py-3 font-medium text-right">Revenus</th>
              <th className="px-4 py-3 font-medium text-right">Coûts</th>
              <th className="px-4 py-3 font-medium text-right">Bénéfice</th>
            </tr>
          </thead>
          <tbody>
            {apercu.par_mois.map((m) => (
              <tr key={m.mois} className={`border-t border-gray-100 ${m.mois === mois ? "bg-brand-light/50" : ""}`}>
                <td className="px-4 py-2.5">
                  <Link href={`/benefices?annee=${annee}&mois=${m.mois}`} className="text-brand-dark hover:underline">
                    {MOIS[m.mois - 1]}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-right">{fmtPrice(m.revenus)}</td>
                <td className="px-4 py-2.5 text-right">{fmtPrice(m.couts)}</td>
                <td className="px-4 py-2.5 text-right font-medium"><Montant value={m.benefice} /></td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-200 font-semibold bg-gray-50">
              <td className="px-4 py-3">Total {annee}</td>
              <td className="px-4 py-3 text-right">{fmtPrice(apercu.total.revenus)}</td>
              <td className="px-4 py-3 text-right">{fmtPrice(apercu.total.couts)}</td>
              <td className="px-4 py-3 text-right"><Montant value={apercu.total.benefice} /></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
