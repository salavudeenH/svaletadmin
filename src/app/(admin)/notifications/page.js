import { apiFetch } from "@/lib/api";
import { toutMarquerLuAction } from "./actions";
import NotificationRow from "./NotificationRow";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

export default async function NotificationsPage() {
  const { data: notifications } = await apiFetch("/admin/notifications");
  const nonLues = notifications.filter((n) => !n.lue).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Changements de date/heure annoncés par un client au voiturier."
        actions={
          nonLues > 0 && (
            <form action={toutMarquerLuAction}>
              <Button type="submit" variant="secondary">
                Tout marquer lu
              </Button>
            </form>
          )
        }
      />

      <div className="bg-white rounded-card border border-gray-200 divide-y divide-gray-100">
        {notifications.map((n) => (
          <NotificationRow key={n._id} notification={n} />
        ))}
        {notifications.length === 0 && <EmptyState>Aucune notification.</EmptyState>}
      </div>
    </div>
  );
}
