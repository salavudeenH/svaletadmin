import { valetApiFetch } from "@/lib/valetApi";
import QuestionnaireWizard from "./QuestionnaireWizard";

export default async function QuestionnairePage({ params }) {
  const { reservationId, leg } = await params;

  const [{ data: course }, parkingsRes] = await Promise.all([
    valetApiFetch(`/me/courses/${reservationId}/${leg}`),
    leg === "aller" ? valetApiFetch("/parkings") : Promise.resolve({ data: [] }),
  ]);

  return (
    <QuestionnaireWizard
      reservationId={reservationId}
      leg={leg}
      course={course}
      parkings={parkingsRes.data || []}
    />
  );
}
