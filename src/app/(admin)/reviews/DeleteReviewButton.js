"use client";

import { deleteReviewAction } from "./actions";

export default function DeleteReviewButton({ id }) {
  return (
    <button
      onClick={() => {
        if (confirm("Supprimer définitivement cet avis ?")) {
          deleteReviewAction(id);
        }
      }}
      className="text-sm text-red-500 hover:underline"
    >
      Supprimer
    </button>
  );
}
