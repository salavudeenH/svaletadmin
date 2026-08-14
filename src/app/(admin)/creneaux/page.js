import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { fmtPrice, fmtDateFR, LEG_LABELS, MODE_LABELS, MODE_BADGE_CLASSES } from "@/lib/creneaux";
import DeleteCreneauButton from "./DeleteCreneauButton";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Table, { Th, Td } from "@/components/ui/Table";
import { Select } from "@/components/ui/FormField";

export default async function CreneauxPage({ searchParams }) {
  const params = await searchParams;
  const valetFilter = params?.valet || "";

  const qs = new URLSearchParams();
  if (valetFilter) qs.set("valet", valetFilter);

  const [{ data: creneaux }, { data: valets }] = await Promise.all([
    apiFetch(`/admin/creneaux${qs.toString() ? `?${qs.toString()}` : ""}`),
    apiFetch("/admin/valets"),
  ]);

  return (
    <div>
      <PageHeader
        title="Créneaux voituriers"
        description="Rémunération des voituriers par plage de courses."
        actions={
          <>
            <Link href="/creneaux/parametres" className="text-sm text-gray-500 hover:text-brand hover:underline">
              Paramètres tarifs
            </Link>
            <Button href="/creneaux/new">+ Nouveau créneau</Button>
          </>
        }
      />

      <form className="mb-4 flex flex-wrap items-center gap-3">
        <Select name="valet" defaultValue={valetFilter} className="w-full sm:w-auto">
          <option value="">Tous les voituriers</option>
          {(valets || []).map((v) => (
            <option key={v._id} value={v._id}>
              {v.prenom} {v.nom}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          Filtrer
        </Button>
      </form>

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Date</Th>
            <Th>Voiturier</Th>
            <Th>Courses</Th>
            <Th>Prix</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {(creneaux || []).map((c) => (
            <tr key={c._id} className="border-t border-gray-100 hover:bg-gray-50 align-top">
              <Td className="whitespace-nowrap">
                <Link href={`/creneaux/${c._id}`} className="font-medium text-brand hover:underline">
                  {fmtDateFR(c.date)}
                </Link>
                {(c.heure_debut || c.heure_fin) && (
                  <div className="text-xs text-gray-400">
                    {c.heure_debut || "?"} – {c.heure_fin || "?"}
                  </div>
                )}
              </Td>
              <Td className="whitespace-nowrap">{c.valet ? `${c.valet.prenom} ${c.valet.nom}` : "—"}</Td>
              <Td>
                <div className="flex flex-col gap-1">
                  {c.courses.map((course, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400 tabular-nums">{course.heure}</span>
                      <span className="text-gray-600">
                        {course.reservation?.numero_reservation || "—"} · {LEG_LABELS[course.leg]}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded ${MODE_BADGE_CLASSES[course.mode]}`}>
                        {MODE_LABELS[course.mode]}
                      </span>
                    </div>
                  ))}
                </div>
              </Td>
              <Td className="whitespace-nowrap">
                <div className="font-medium">{fmtPrice(c.prix_final)}</div>
                {c.prix_final !== c.prix_propose && (
                  <div className="text-xs text-gray-400">suggéré : {fmtPrice(c.prix_propose)}</div>
                )}
              </Td>
              <Td className="text-right whitespace-nowrap">
                <Link href={`/creneaux/${c._id}`} className="text-sm text-gray-500 hover:text-brand hover:underline mr-3">
                  Modifier
                </Link>
                <DeleteCreneauButton id={c._id} />
              </Td>
            </tr>
          ))}
          {(creneaux || []).length === 0 && (
            <tr>
              <Td colSpan={5} className="py-8 text-center text-gray-400">
                Aucun créneau pour l'instant.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
