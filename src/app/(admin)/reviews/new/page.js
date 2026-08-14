import Link from "next/link";
import ReviewForm from "../ReviewForm";
import { createReviewAction } from "../actions";

export default function NewReviewPage() {
  return (
    <div>
      <Link href="/reviews" className="text-sm text-brand hover:underline">
        ← Retour aux avis
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouvel avis</h1>
      <ReviewForm action={createReviewAction} submitLabel="Créer" />
    </div>
  );
}
