import PageHeader from "../../../../_components/PageHeader";
import NouveauFraisForm from "./NouveauFraisForm";

export default async function NouveauFraisPage({ searchParams }) {
  const params = await searchParams;
  const mois = params?.mois || "";
  return (
    <div>
      <PageHeader title="Ajouter un frais" backHref={`/voiturier/cagnotte/frais${mois ? `?mois=${mois}` : ""}`} />
      <NouveauFraisForm mois={mois} />
    </div>
  );
}
