import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { fetchData } from "~/lib/apiRequest";
import { getAllXPermissionsForRoleHierarchy } from "~/lib/xPermission";
import {
  isPermissionArray,
  isPermissionGroupArray,
  isRolesArray,
  type Role,
} from "~/types";
import PermissionManagement from "./_components/PermissionManagement";

// Loading skeleton for the permission management page
const PermissionManagementSkeleton = () => (
  <div className="mx-auto w-full max-w-7xl space-y-8 p-6">
    <div className="mb-8 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-36" />
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex h-full flex-col overflow-hidden">
          <Skeleton className="h-12 w-full" />
          <div className="flex flex-1 flex-col space-y-3 p-5">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex-1 space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton
                  key={j}
                  className={`h-4 w-${j === 2 ? "4" : j === 1 ? "5" : ""}6`}
                />
              ))}
            </div>
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const Page = async () => {
  try {
    // Fetch all required data in parallel
    const [roles, permissionGroups, permissions] = await Promise.all([
      fetchData("/roles"),
      fetchData("/permissions/groups"),
      fetchData("/permissions"),
    ]);

    if (!isRolesArray(roles)) {
      return (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Invalid roles data. Please check the API response format.
          </p>
        </div>
      );
    }

    if (!isPermissionGroupArray(permissionGroups)) {
      return (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Invalid permission groups data. Please check the API response
            format.
          </p>
        </div>
      );
    }

    if (!isPermissionArray(permissions)) {
      return (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Invalid permissions data. Please check the API response format.
          </p>
        </div>
      );
    }

    // Process role permissions with hierarchy
    const rolePermissions: Record<
      string,
      {
        direct: string[];
        inherited: Array<{
          id: string;
          sourceRoleId: string;
          sourceRoleName: string;
        }>;
      }
    > = {};

    for (const role of roles) {
      if (!role.id) continue;

      const perms = await getAllXPermissionsForRoleHierarchy(role.id);
      rolePermissions[role.id] = {
        direct: Array.from(perms.direct),
        inherited: Array.from(perms.inherited.entries()).map(
          ([id, sourceRoleId]) => ({
            id,
            sourceRoleId,
            sourceRoleName:
              roles.find((r: Role) => r.id === sourceRoleId)?.name ?? "Unknown",
          }),
        ),
      };
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <PermissionManagement
          permissionGroupsData={permissionGroups}
          permissionsData={permissions}
          rolesData={roles}
          rolePermissionsData={rolePermissions}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading permission management data:", error);
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          Failed to load data. Please check your network connection and API
          endpoints.
        </p>
      </div>
    );
  }
};

export default function PermissionManagementPage() {
  return (
    <Suspense fallback={<PermissionManagementSkeleton />}>
      <Page />
    </Suspense>
  );
}
