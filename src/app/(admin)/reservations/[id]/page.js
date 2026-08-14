import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatDate, suiviVoiturier } from "@/lib/statuts";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ReservationForm from "./ReservationForm";
import PaymentLinkButton from "./PaymentLinkButton";
import InvoiceButton from "./InvoiceButton";
import EmailActionsCard from "./EmailActionsCard";
import NotificationBanner from "./NotificationBanner";
import { updateReservationAction } from "./actions";

function PhotoGallery({ title, urls }) {
  return (
    <div className="mt-3">
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      {urls && urls.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {urls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <img src={url} alt={`${title} ${i + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Non renseigné</p>
      )}
    </div>
  );
}

function BooleanBadge({ value }) {
  if (value === undefined || value === null) {
    return <Badge variant="neutral">Non renseigné</Badge>;
  }
  return <Badge variant={value ? "brand" : "neutral"}>{value ? "Oui" : "Non"}</Badge>;
}

export default async function ReservationDetailPage({ params }) {
  const { id } = await params;

  const [{ data: reservation }, { data: valets }, { data: parkings }, { data: notifications }] = await Promise.all([
    apiFetch(`/admin/reservations/${id}`),
    apiFetch(`/admin/valets?actif=true`),
    apiFetch(`/admin/parkings?actif=true`),
    apiFetch(`/admin/notifications?reservation=${id}`),
  ]);
  const notificationsNonLues = notifications.filter((n) => !n.lue);

  const boundAction = updateReservationAction.bind(null, id);

  return (
    <div className="max-w-3xl">
      <Link href="/reservations" className="text-sm text-brand hover:underline">
        ← Retour aux réservations
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-ink">
            Réservation {reservation.numero_reservation || reservation._id.slice(-6)}
          </h1>
          <Badge variant={suiviVoiturier(reservation).variant}>{suiviVoiturier(reservation).label}</Badge>
        </div>
        <InvoiceButton reservation={reservation} />
      </div>

      {notificationsNonLues.length > 0 && (
        <div className="mb-6 space-y-2">
          {notificationsNonLues.map((n) => (
            <NotificationBanner key={n._id} notification={n} />
          ))}
        </div>
      )}

      <Card className="mb-6">
        <h2 className="font-semibold text-ink mb-3">Informations</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
          <dt className="text-gray-500">Client</dt>
          <dd>
            {reservation.contact_prenom || reservation.user?.firstname}{" "}
            {reservation.contact_nom || reservation.user?.lastname}
          </dd>

          <dt className="text-gray-500">Email</dt>
          <dd>{reservation.contact_email || reservation.user?.email}</dd>

          <dt className="text-gray-500">Téléphone</dt>
          <dd>{reservation.contact_telephone || reservation.user?.phone}</dd>

          <dt className="text-gray-500">Date aller</dt>
          <dd>
            {formatDate(reservation.date_aller)} {reservation.heure_aller}
          </dd>

          <dt className="text-gray-500">Date retour</dt>
          <dd>
            {formatDate(reservation.date_retour)} {reservation.heure_retour}
          </dd>

          <dt className="text-gray-500">Partenaire / parking</dt>
          <dd>
            {reservation.partenaire} — {reservation.parking_nom || reservation.parking}
          </dd>

          <dt className="text-gray-500">Véhicule</dt>
          <dd>
            {reservation.vehicle_snapshot
              ? `${reservation.vehicle_snapshot.marque} ${reservation.vehicle_snapshot.modele} (${reservation.vehicle_snapshot.plaque})`
              : "-"}
          </dd>

          <dt className="text-gray-500">Prix de base</dt>
          <dd>{reservation.montant_base ?? 0} €</dd>

          {reservation.code_promo && (
            <>
              <dt className="text-gray-500">Code promo</dt>
              <dd>
                {reservation.code_promo} (-{reservation.montant_reduction ?? 0} €)
              </dd>
            </>
          )}

          <dt className="text-gray-500">Montant total</dt>
          <dd className="font-medium">{reservation.montant_total} €</dd>
        </dl>
      </Card>

      <Card className="mb-6">
        <h2 className="font-semibold text-ink mb-3">Options achetées</h2>
        {reservation.options?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500">
                  <tr>
                    <th className="py-1.5 font-medium">Option</th>
                    <th className="py-1.5 font-medium">Qté</th>
                    <th className="py-1.5 font-medium">Prix unitaire</th>
                    <th className="py-1.5 font-medium">Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  {reservation.options.map((opt, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-1.5">{opt.nom}</td>
                      <td className="py-1.5">{opt.qty}</td>
                      <td className="py-1.5">{opt.prix} €</td>
                      <td className="py-1.5 font-medium">{opt.subtotal} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-right mt-2 font-medium">
              Total options : {reservation.montant_options ?? 0} €
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">Aucune option achetée.</p>
        )}
      </Card>

      {!["payee", "terminee", "annulee"].includes(reservation.statut) && (
        <div className="mb-6">
          <PaymentLinkButton reservationId={reservation._id} />
        </div>
      )}

      <div className="mb-6">
        <EmailActionsCard reservationId={reservation._id} valetAller={reservation.valet_aller} />
      </div>

      <Card className="mb-6">
        <h2 className="font-semibold text-ink mb-3">Infos voiturier</h2>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Prise en charge</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
            <dt className="text-gray-500">Client rencontré à</dt>
            <dd>
              {reservation.aller_confirme_le
                ? `${formatDate(reservation.aller_confirme_le)} ${new Date(reservation.aller_confirme_le).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                : <span className="text-gray-400">Pas encore confirmé</span>}
            </dd>

            <dt className="text-gray-500">Sky Priority</dt>
            <dd><BooleanBadge value={reservation.sky_priority} /></dd>

            <dt className="text-gray-500">Bagages en soute au retour</dt>
            <dd><BooleanBadge value={reservation.bagages_soute} /></dd>

            <dt className="text-gray-500">Revient à la date prévue</dt>
            <dd>
              <BooleanBadge value={reservation.retour_confirme_par_client} />
              {reservation.date_retour_annoncee && (
                <span className="text-gray-500"> — nouvelle date annoncée : {formatDate(reservation.date_retour_annoncee)}</span>
              )}
            </dd>

            <dt className="text-gray-500">Vol retour</dt>
            <dd>
              {[reservation.numero_vol_retour, reservation.vol_retour_ville_depart, reservation.vol_retour_compagnie].filter(Boolean).join(" · ") || (
                <span className="text-gray-400">Non renseigné</span>
              )}
            </dd>

            <dt className="text-gray-500">Kilométrage au dépôt</dt>
            <dd>{reservation.kilometrage_depot != null ? `${reservation.kilometrage_depot} km` : <span className="text-gray-400">Non renseigné</span>}</dd>
          </dl>
          {reservation.signature_depot ? (
            <div className="mt-3">
              <p className="text-gray-500 text-sm mb-1">Signature client (dépôt)</p>
              <img src={reservation.signature_depot} alt="Signature dépôt" className="border border-gray-200 rounded-lg max-w-xs bg-white" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-3">Signature non renseignée</p>
          )}

          <PhotoGallery title="Photos prise en charge (dépose-minute)" urls={reservation.photos_prise_en_charge_urls} />
          <PhotoGallery title="Photo véhicule garé" urls={reservation.photos_voiture_garee_urls} />
          <PhotoGallery title="Photo dépôt clé au coffre" urls={reservation.photos_cle_coffre_urls} />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Restitution</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
            <dt className="text-gray-500">Client rencontré à</dt>
            <dd>
              {reservation.retour_confirme_le
                ? `${formatDate(reservation.retour_confirme_le)} ${new Date(reservation.retour_confirme_le).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
                : <span className="text-gray-400">Pas encore confirmé</span>}
            </dd>

            <dt className="text-gray-500">Kilométrage au retour</dt>
            <dd>{reservation.kilometrage_retour != null ? `${reservation.kilometrage_retour} km` : <span className="text-gray-400">Non renseigné</span>}</dd>

            <dt className="text-gray-500">Incident signalé</dt>
            <dd>
              <BooleanBadge value={reservation.incident_signale} />
              {reservation.incident_signale && reservation.incident_description && (
                <span className="text-gray-600"> — {reservation.incident_description}</span>
              )}
            </dd>
          </dl>
          {reservation.signature_retour ? (
            <div className="mt-3">
              <p className="text-gray-500 text-sm mb-1">Signature client (retour)</p>
              <img src={reservation.signature_retour} alt="Signature retour" className="border border-gray-200 rounded-lg max-w-xs bg-white" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm mt-3">Signature non renseignée</p>
          )}
        </div>
      </Card>

      <ReservationForm reservation={reservation} valets={valets} parkings={parkings} action={boundAction} />
    </div>
  );
}
