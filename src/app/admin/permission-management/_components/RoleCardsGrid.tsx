// RoleCardsGrid.tsx
import { type Permission, type Role } from "~/types";
import RoleCard from "./RoleCard";

interface RoleCardsGridProps {
  roles: Role[];
  rolePermissions: Record<
    string,
    {
      direct: Set<string>;
      inherited: Map<
        string,
        { id: string; sourceRoleId: string; sourceRoleName: string }
      >;
    }
  >;
  permissions: Permission[];
  onManagePermissions: (roleId: string) => void;
}

/**
 * Grid component to display all role cards
 */
const RoleCardsGrid = ({
  roles,
  rolePermissions,
  permissions,
  onManagePermissions,
}: RoleCardsGridProps) => {
  if (!roles.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          No roles available. Create roles to manage their permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => {
        // Find parent role
        const parentRole = role.parentId
          ? roles.find((r) => r.id === role.parentId)
          : null;

        return (
          <RoleCard
            key={role.id}
            role={role}
            rolePermissions={rolePermissions}
            parentRole={parentRole}
            permissions={permissions}
            onManagePermissions={onManagePermissions}
          />
        );
      })}
    </div>
  );
};

export default RoleCardsGrid;