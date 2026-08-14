import { valetApiFetch } from "@/lib/valetApi";
import QuestionnaireWizard from "./QuestionnaireWizard";

export default async function QuestionnairePage({ params }) {
  const { reservationId, leg } = await params;

  const [{ data: course }, parkingsRes, numeroCleRes] = await Promise.all([
    valetApiFetch(`/me/courses/${reservationId}/${leg}`),
    leg === "aller" ? valetApiFetch("/parkings") : Promise.resolve({ data: [] }),
    leg === "aller" ? valetApiFetch("/next-numero-cle") : Promise.resolve({ data: {} }),
  ]);

  return (
    <QuestionnaireWizard
      reservationId={reservationId}
      leg={leg}
      course={course}
      parkings={parkingsRes.data || []}
      suggestionNumeroCle={numeroCleRes.data?.numero_cle || ""}
    />
  );
}
