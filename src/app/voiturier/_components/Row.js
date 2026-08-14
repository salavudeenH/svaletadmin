export function Row({ icon, action, children }) {
  return (
    <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 text-ink flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
      {action}
    </div>
  );
}

export function Badge({ children }) {
  return (
    <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
      {children}
    </span>
  );
}
