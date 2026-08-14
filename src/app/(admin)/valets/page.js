import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { getRole } from "@/lib/session";
import { toggleValetAction } from "./actions";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Table, { Th, Td } from "@/components/ui/Table";

export default async function ValetsPage() {
  const [{ data: valets }, role] = await Promise.all([apiFetch("/admin/valets"), getRole()]);
  const canManage = role !== "manager";

  return (
    <div>
      <PageHeader title="Voituriers" actions={canManage && <Button href="/valets/new">+ Nouveau voiturier</Button>} />

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Nom</Th>
            <Th>Téléphone</Th>
            <Th>Email</Th>
            <Th>Code PIN</Th>
            <Th>Statut</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {valets.map((v) => (
            <tr key={v._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/valets/${v._id}`} className="font-medium text-brand hover:underline">
                  {v.prenom} {v.nom}
                </Link>
              </Td>
              <Td>{v.telephone}</Td>
              <Td>{v.email}</Td>
              <Td>
                {v.pin ? (
                  <span className="font-mono tracking-widest">{v.pin}</span>
                ) : (
                  <span className="text-gray-400">Non défini</span>
                )}
              </Td>
              <Td>
                <Badge variant={v.actif ? "success" : "neutral"}>{v.actif ? "Actif" : "Inactif"}</Badge>
              </Td>
              <Td className="text-right">
                {canManage && (
                  <form action={toggleValetAction.bind(null, v._id)}>
                    <button type="submit" className="text-sm text-gray-500 hover:text-brand hover:underline">
                      {v.actif ? "Désactiver" : "Réactiver"}
                    </button>
                  </form>
                )}
              </Td>
            </tr>
          ))}
          {valets.length === 0 && (
            <tr>
              <Td colSpan={6} className="py-8 text-center text-gray-400">
                Aucun voiturier enregistré.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
