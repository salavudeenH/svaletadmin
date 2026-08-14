import { valetApiFetch } from "@/lib/valetApi";
import ParametresForm from "./ParametresForm";
import { updateProfileAction } from "./actions";
import PageHeader from "../../_components/PageHeader";

export default async function VoiturierParametresPage() {
  const { data: valet } = await valetApiFetch("/me");

  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Mes informations" />

      <div className="px-4 py-4">
        <ParametresForm valet={valet} action={updateProfileAction} />
      </div>
    </div>
  );
}
