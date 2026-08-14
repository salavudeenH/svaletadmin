import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { toggleReviewAction } from "./actions";
import DeleteReviewButton from "./DeleteReviewButton";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Table, { Th, Td } from "@/components/ui/Table";

const SOURCE_LABELS = { manual: "Manuel", google: "Google", facebook: "Facebook", booking: "Booking" };

export default async function ReviewsPage() {
  const { data: reviews } = await apiFetch("/admin/reviews");

  return (
    <div>
      <PageHeader title="Avis clients" actions={<Button href="/reviews/new">+ Nouvel avis</Button>} />

      <Table>
        <thead className="bg-gray-50 text-left text-gray-500">
          <tr>
            <Th>Client</Th>
            <Th>Note</Th>
            <Th>Avis</Th>
            <Th>Source</Th>
            <Th>Ordre</Th>
            <Th>Statut</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r._id} className="border-t border-gray-100 hover:bg-gray-50">
              <Td>
                <Link href={`/reviews/${r._id}`} className="font-medium text-brand hover:underline">
                  {r.name}
                </Link>
                <div className="text-xs text-gray-400">{r.date}</div>
              </Td>
              <Td className="text-amber-500">
                {"★".repeat(r.rating)}
                <span className="text-gray-200">{"★".repeat(5 - r.rating)}</span>
              </Td>
              <Td className="max-w-xs truncate text-gray-600">{r.text}</Td>
              <Td>{SOURCE_LABELS[r.source] || r.source}</Td>
              <Td>{r.order}</Td>
              <Td>
                <Badge variant={r.isActive ? "success" : "neutral"}>{r.isActive ? "Visible" : "Masqué"}</Badge>
              </Td>
              <Td className="text-right space-x-3 whitespace-nowrap">
                <form action={toggleReviewAction.bind(null, r._id)} className="inline">
                  <button type="submit" className="text-sm text-gray-500 hover:text-brand hover:underline">
                    {r.isActive ? "Masquer" : "Afficher"}
                  </button>
                </form>
                <DeleteReviewButton id={r._id} />
              </Td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <Td colSpan={7} className="py-8 text-center text-gray-400">
                Aucun avis enregistré.
              </Td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
