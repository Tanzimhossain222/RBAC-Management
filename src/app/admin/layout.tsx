"use client";
import { ModeToggle } from "@/components/mode-toggle";
import {
  LucideLayoutDashboard,
  LucideLock,
  LucideSettings,
  LucideShieldCheck,
  LucideUsers,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Create a sidebar link component for consistent styling
function SidebarLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
          : "text-foreground/70 hover:bg-sidebar-accent hover:text-foreground"
      }`}
    >
      <Icon
        className={`h-4 w-4 ${isActive ? "text-sidebar-primary-foreground" : "text-foreground/60"}`}
      />
      <span>{children}</span>
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-sidebar border-sidebar-border fixed inset-y-0 hidden w-64 flex-col border-r md:flex">
        <div className="border-sidebar-border flex h-14 items-center border-b px-4">
          <div className="text-lg font-semibold">Admin Panel</div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <SidebarLink href="/admin" icon={LucideLayoutDashboard}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/admin/roles" icon={LucideShieldCheck}>
            Roles
          </SidebarLink>
          <SidebarLink href="/admin/permissions" icon={LucideLock}>
            Permissions
          </SidebarLink>
          <SidebarLink
            href="/admin/permission-management"
            icon={LucideSettings}
          >
            Permission Management
          </SidebarLink>
          <SidebarLink href="/admin/users" icon={LucideUsers}>
            Users
          </SidebarLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:pl-64">
        <div className="border-border flex h-14 items-center justify-between border-b px-6">
          <h1 className="text-lg font-semibold">Admin</h1>
          <ModeToggle />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
