// app/admin/users/ChangeRoleButton.tsx
"use client";

import { changeUserRole } from "@/actions/admin";
import { useState } from "react";

export function ChangeRoleButton({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    setLoading(true);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await changeUserRole(userId, newRole);
    setLoading(false);
  }

  return (
    <button
      onClick={handleChange}
      disabled={loading}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        currentRole === "ADMIN"
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {loading ? "..." : currentRole === "ADMIN" ? "ADMIN" : "USER"}
    </button>
  );
}