// page.tsx
import type { Role } from "@prisma/client";
import { fetchData } from "~/lib/apiRequest";
import { getAllXPermissionsForRoleHierarchy } from "~/lib/xPermission";
import PermissionManagement from "./_components/PermissionManagement";

const page = async () => {
  try {
    const [roles, permissionGroups, permissions] = await Promise.all([
      fetchData("/roles"),
      fetchData("/permissions/groups"),
      fetchData("/permissions"),
    ]);

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
      const perms = await getAllXPermissionsForRoleHierarchy(role.id);
      rolePermissions[role.id] = {
        direct: Array.from(perms.direct),
        inherited: Array.from(perms.inherited.entries()).map(
          ([id, sourceRoleId]) => ({
            id,
            sourceRoleId,
            sourceRoleName:
              roles.find((r: Role) => r.id === sourceRoleId)?.name || "Unknown",
          }),
        ),
      };
    }

    return (
      <div>
        <PermissionManagement
          permissionGroupsData={permissionGroups}
          permissionsData={permissions}
          rolesData={roles}
          rolePermissionsData={rolePermissions}
        />
      </div>
    );
  } catch (error) {
    return <p className="text-red-600">Failed to load data.</p>;
  }
};

export default page;
