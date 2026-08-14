import { apiFetch } from "@/lib/api";
import RoleForm from "./RoleForm";
import { updateUserRoleAction } from "./actions";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Table, { Th, Td } from "@/components/ui/Table";
import { Input } from "@/components/ui/FormField";

export default async function UsersPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";

  const query = new URLSearchParams();
  if (search) query.set("search", search);

  const { data: users } = await apiFetch(`/admin/users?${query.toString()}`);

  return (
    <div>
      <PageHeader title="Utilisateurs" />

      <form className="flex flex-wrap gap-3 mb-5" method="get">
        <Input type="text" name="search" defaultValue={search} placeholder="Nom, email..." className="w-full sm:w-64" />
        <Button type="submit">Rechercher</Button>
      </form>

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Nom</Th>
            <Th>Email</Th>
            <Th>Téléphone</Th>
            <Th>Rôle</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                {u.firstname} {u.lastname}
              </Td>
              <Td>{u.email}</Td>
              <Td>{u.phone || "-"}</Td>
              <Td>
                <RoleForm userId={u._id} role={u.role} action={updateUserRoleAction} />
              </Td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <Td colSpan={4} className="py-8 text-center text-gray-400">
                Aucun utilisateur trouvé.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
