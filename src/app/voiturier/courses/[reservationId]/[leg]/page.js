import Link from "next/link";
import { valetApiFetch } from "@/lib/valetApi";
import { User, Phone, Car, Plane, KeyRound, ParkingCircle, Luggage } from "lucide-react";
import ConfirmButton from "./ConfirmButton";
import PhotosButton from "./PhotosButton";
import { Row, Badge } from "../../../_components/Row";

function fmtDateFR(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function VoiturierCourseDetailPage({ params }) {
  const { reservationId, leg } = await params;
  const [{ data: c }, { data: moi }] = await Promise.all([
    valetApiFetch(`/me/courses/${reservationId}/${leg}`),
    valetApiFetch("/me"),
  ]);

  const isAller = c.leg === "aller";
  const barColor = isAller ? "bg-brand" : "bg-ink";
  const estAMoi = c.valet?._id === moi._id;

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className={`${barColor} text-white px-4 py-4 flex items-center gap-3`}>
        <Link href="/voiturier" className="text-white/80 text-lg leading-none">
          ←
        </Link>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-white/70">
            {isAller ? "Prise en charge" : "Restitution"}
          </div>
          <div className="font-semibold">{fmtDateFR(c.date)} · {c.heure || "—"}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wide text-white/60">Voiturier</div>
          {c.valet ? (
            estAMoi ? (
              <div className="text-sm font-medium">Moi</div>
            ) : c.valet.telephone ? (
              <a href={`tel:${c.valet.telephone}`} className="text-sm font-medium underline decoration-dotted">
                {c.valet.prenom} {c.valet.nom}
              </a>
            ) : (
              <div className="text-sm font-medium">{c.valet.prenom} {c.valet.nom}</div>
            )
          ) : (
            <div className="text-sm font-medium text-white/80 italic">Pas assigné</div>
          )}
        </div>
      </div>

      <Row
        icon={<User size={18} />}
        action={
          c.client.telephone && (
            <a
              href={`tel:${c.client.telephone}`}
              className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center shrink-0"
              aria-label="Appeler le client"
            >
              <Phone size={18} />
            </a>
          )
        }
      >
        <div className="text-xs text-gray-400">Client</div>
        <div className="font-semibold text-ink truncate">{c.client.nom || "Client SVALET"}</div>
      </Row>

      <Row icon={<Car size={18} />}>
        <div className="text-xs text-gray-400">Véhicule</div>
        <div className="font-medium text-ink">
          {c.vehicule?.marque} {c.vehicule?.modele}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {c.vehicule?.plaque && <span className="text-sm text-gray-500 font-mono">{c.vehicule.plaque}</span>}
          {c.vehicule?.couleur && <Badge>{c.vehicule.couleur}</Badge>}
          {c.numero_cle && (
            <Badge>
              <span className="inline-flex items-center gap-1">
                <KeyRound size={11} /> {c.numero_cle}
              </span>
            </Badge>
          )}
        </div>
      </Row>

      {!isAller && (c.sky_priority !== null || c.bagages_soute !== null) && (
        <Row icon={<Luggage size={18} />}>
          <div className="text-xs text-gray-400">Infos retour</div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {c.sky_priority !== null && <Badge>{c.sky_priority ? "Sky Priority" : "Pas Sky Priority"}</Badge>}
            {c.bagages_soute !== null && <Badge>{c.bagages_soute ? "Bagages en soute" : "Bagages en cabine"}</Badge>}
          </div>
        </Row>
      )}

      {(c.vol?.numero || c.vol?.terminal || c.vol?.provenance) && (
        <Row icon={<Plane size={18} />}>
          <div className="text-xs text-gray-400">Vol</div>
          <div className="font-medium text-ink">
            {c.vol.numero || "—"}
            {c.vol.provenance && <span className="text-gray-500 font-normal"> · {c.vol.provenance}</span>}
          </div>
          {c.vol.terminal && (
            <div className="mt-1.5">
              <Badge>Terminal {c.vol.terminal}</Badge>
            </div>
          )}
        </Row>
      )}

      {c.parking_nom && (
        <Row icon={<ParkingCircle size={18} />}>
          <div className="text-xs text-gray-400">Parking</div>
          <div className="font-medium text-ink">{c.parking_nom}</div>
        </Row>
      )}

      {!isAller && (
        <div className="bg-white px-4 py-4 space-y-3">
          <PhotosButton label="Voiture garée" urls={c.photos_voiture_garee_urls} />
          <PhotosButton label="Clé au coffre" urls={c.photos_cle_coffre_urls} />
        </div>
      )}

      <div className="px-4 pt-6">
        {!c.confirme_le && c.valet && !estAMoi && (
          <div className="mb-3 text-xs text-gray-500 text-center">
            Course assignée à {c.valet.prenom} {c.valet.nom} — cliquer ci-dessous vous l'assigne à vous.
          </div>
        )}
        <ConfirmButton reservationId={reservationId} leg={leg} confirmeLe={c.confirme_le} />
      </div>
    </div>
  );
}
