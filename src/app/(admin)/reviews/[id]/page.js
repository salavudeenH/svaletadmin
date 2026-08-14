import Link from "next/link";
import { apiFetch } from "@/lib/api";
import ReviewForm from "../ReviewForm";
import { updateReviewAction } from "../actions";

export default async function EditReviewPage({ params }) {
  const { id } = await params;
  const { data: reviews } = await apiFetch("/admin/reviews");
  const review = reviews.find((r) => r._id === id);

  const boundAction = updateReviewAction.bind(null, id);

  return (
    <div>
      <Link href="/reviews" className="text-sm text-brand hover:underline">
        ← Retour aux avis
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">{review?.name}</h1>
      <ReviewForm review={review} action={boundAction} />
    </div>
  );
}
