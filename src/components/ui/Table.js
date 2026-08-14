export default function Table({ children, className = "" }) {
  return (
    <div className="bg-white rounded-card border border-gray-200 overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

export function Th({ children, className = "", ...props }) {
  return (
    <th className={`px-4 py-3 font-medium whitespace-nowrap ${className}`} {...props}>
      {children}
    </th>
  );
}

export function Td({ children, className = "", ...props }) {
  return (
    <td className={`px-4 py-3 ${className}`} {...props}>
      {children}
    </td>
  );
}
