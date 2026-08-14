export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-card border border-gray-200 p-4 sm:p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-brand mt-1">{value}</p>
    </div>
  );
}
