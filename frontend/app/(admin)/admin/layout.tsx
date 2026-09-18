import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session || session.role !== "ADMIN") {
    redirect("/login?from=/admin");
  }

  return (
    <AdminShell sessionUser={session}>
      {children}
    </AdminShell>
  );
}
