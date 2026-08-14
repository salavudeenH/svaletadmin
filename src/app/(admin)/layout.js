import { redirect } from "next/navigation";
import { getSessionToken, getRole } from "@/lib/session";
import { apiFetch } from "@/lib/api";
import Sidebar from "./Sidebar";

export default async function AdminLayout({ children }) {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }
  const role = await getRole();

  let notifCount = 0;
  try {
    const { data } = await apiFetch("/admin/notifications/count-non-lues");
    notifCount = data.count;
  } catch {
    // pas bloquant pour l'affichage du reste de l'admin
  }

  return (
    <div className="lg:flex">
      <Sidebar role={role} notifCount={notifCount} />
      <main className="flex-1 min-h-screen p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">{children}</main>
    </div>
  );
}
