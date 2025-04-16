// PermissionCheckItem.tsx
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpCircle, Lock } from "lucide-react";
import { type Permission } from "~/types";

interface PermissionCheckItemProps {
  permission: Permission;
  selectedRoleId: string | null;
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
  togglePermission: (permissionId: string) => void;
}

/**
 * Component to display a single permission item with checkbox
 */
const PermissionCheckItem = ({
  permission,
  selectedRoleId,
  rolePermissions,
  togglePermission,
}: PermissionCheckItemProps) => {
  if (!selectedRoleId) return null;

  const selectedRolePerms = rolePermissions[selectedRoleId];
  if (!selectedRolePerms) return null;

  const permKey = `${permission.action}:${permission.resource}`;
  const isDirectlyAssigned = selectedRolePerms.direct.has(permKey);
  const inheritedFrom = selectedRolePerms.inherited.get(permKey);
  const isInherited = !!inheritedFrom;

  // Format permission name or create one from action/resource if not available
  const permissionName = permission.name || `${permission.action} ${permission.resource}`;

  // Format resource and action for display
  const resource = permission.resource.charAt(0).toUpperCase() + permission.resource.slice(1);
  const action = permission.action.charAt(0).toUpperCase() + permission.action.slice(1);

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-100 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <Checkbox
          id={`perm-${permission.id}`}
          checked={isDirectlyAssigned || isInherited}
          disabled={isInherited}
          onClick={() => togglePermission(permission.id!)}
        />

        <div className="flex flex-col">
          <label
            htmlFor={isInherited ? undefined : `perm-${permission.id}`}
            className="text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              {permissionName}
              {isInherited && (
                <Badge variant="outline" className="ml-1 gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-400">
                  <Lock className="h-3 w-3" />
                  Inherited from {inheritedFrom.sourceRoleName}
                </Badge>
              )}
              {permission.description && (
                <HelpCircle
                  className="h-3.5 w-3.5 text-gray-400"
                  title={permission.description}
                />
              )}
            </span>
          </label>
          <div className="flex gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Badge variant="secondary" className="text-xs">
              {action}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {resource}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionCheckItem;