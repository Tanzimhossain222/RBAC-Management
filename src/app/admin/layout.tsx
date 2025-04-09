// app/admin/layout.tsx
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Sidebar */}
      <aside className="border-border bg-muted/40 hidden w-64 border-r p-4 md:block">
        <div className="mb-4 text-lg font-bold">Admin Panel</div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/roles">Roles</Link>
          <Link href="/admin/permissions">Permissions</Link>
          <Link href="/admin/permission-management">Permission Management</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <ModeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
