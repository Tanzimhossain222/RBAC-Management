// RoleCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint, User, Users } from "lucide-react";
import { type Permission, type Role } from "~/types";

interface RoleCardProps {
  role: Role;
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
  parentRole: Role | null;
  permissions: Permission[];
  onManagePermissions: (roleId: string) => void;
}

/**
 * Component to display a single role card with permissions summary
 */
const RoleCard = ({
  role,
  rolePermissions,
  parentRole,
  permissions,
  onManagePermissions,
}: RoleCardProps) => {
  // Get permission data for this role
  const rolePermissionData = rolePermissions[role.id!];

  const directPermissionsCount = rolePermissionData?.direct?.size ?? 0;
  const inheritedPermissionsCount = rolePermissionData?.inherited?.size ?? 0;

  // Get unique permissions by combining direct and inherited without duplicates
  const directPermissions = rolePermissionData?.direct ?? new Set<string>();
  const inheritedPermissionIds = Array.from(
    rolePermissionData?.inherited?.values() ?? [],
  ).map((p) => p.id);
  const uniquePermissions = new Set([
    ...directPermissions,
    ...inheritedPermissionIds,
  ]);
  const uniquePermissionsCount = uniquePermissions.size;

  // Calculate percentage of total permissions
  const totalAvailablePermissions = permissions.length;
  const permissionPercentage =
    totalAvailablePermissions > 0
      ? Math.round((uniquePermissionsCount / totalAvailablePermissions) * 100)
      : 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-500" />
          {role.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4 pt-6">
        {role.description && (
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {role.description}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {parentRole && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <Users className="h-3 w-3" />
              Parent: {parentRole.name}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400"
          >
            <Fingerprint className="h-3 w-3" />
            {permissionPercentage}% of permissions
          </Badge>
        </div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Direct permissions
            </span>
            <Badge variant="secondary">{directPermissionsCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Inherited permissions
            </span>
            <Badge variant="secondary">{inheritedPermissionsCount}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <Button
          className="w-full"
          onClick={() => onManagePermissions(role.id!)}
        >
          Manage Permissions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
