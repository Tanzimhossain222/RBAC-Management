// page.tsx

import { fetchData } from "~/lib/apiRequest";
import { getAllXPermissionsForRoleHierarchy } from "~/lib/xPermission";
import {
  isPermissionArray,
  isPermissionGroupArray,
  isRolesArray,
  type Role,
} from "~/types";
import PermissionManagement from "./_components/PermissionManagement";

const page = async () => {
  try {
    const [roles, permissionGroups, permissions] = await Promise.all([
      fetchData("/roles"),
      fetchData("/permissions/groups"),
      fetchData("/permissions"),
    ]);

    if (!isRolesArray(roles)) {
      return <p className="text-red-600">Invalid roles data.</p>;
    }

    if (!isPermissionGroupArray(permissionGroups)) {
      return <p className="text-red-600">Invalid permission groups data.</p>;
    }

    if (!isPermissionArray(permissions)) {
      return <p className="text-red-600">Invalid permissions data.</p>;
    }

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
      const perms = await getAllXPermissionsForRoleHierarchy(role.id!);
      rolePermissions[role.id!] = {
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
