"use client";

const ROLES = ["client", "valet", "admin", "partner", "manager"];

export default function RoleForm({ userId, role, action }) {
  return (
    <form action={action.bind(null, userId)}>
      <select
        name="role"
        defaultValue={role}
        onChange={(e) => e.currentTarget.form.requestSubmit()}
        className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </form>
  );
}
