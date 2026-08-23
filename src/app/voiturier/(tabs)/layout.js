import { valetApiFetch } from "@/lib/valetApi";
import TabsNav from "./TabsNav";

export default async function VoiturierTabsLayout({ children }) {
  const { data: bloquantes } = await valetApiFetch("/me/courses-bloquantes");

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {children}
      <TabsNav bloquantesCount={(bloquantes || []).length} />
    </div>
  );
}
