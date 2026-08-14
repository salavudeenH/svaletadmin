import Link from "next/link";

export default function ConfirmButton({ reservationId, leg, confirmeLe }) {
  if (confirmeLe) {
    return (
      <div className="w-full bg-emerald-50 text-emerald-700 font-semibold rounded-xl px-4 py-3.5 text-center">
        ✓ Client rencontré
      </div>
    );
  }

  return (
    <Link
      href={`/voiturier/courses/${reservationId}/${leg}/questionnaire`}
      className="block w-full bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl px-4 py-3.5 transition-colors text-center"
    >
      JE SUIS AVEC LE CLIENT
    </Link>
  );
}
