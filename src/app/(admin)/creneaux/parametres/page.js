import { apiFetch } from "@/lib/api";
import CreneauSettingsForm from "./CreneauSettingsForm";

export default async function CreneauSettingsPage() {
  const { data: settings } = await apiFetch("/admin/creneaux-settings");

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Paramètres des créneaux</h1>
      <CreneauSettingsForm settings={settings} />
    </div>
  );
}
