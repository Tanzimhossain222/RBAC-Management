// PermissionGroupList.tsx
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { type Permission, type PermissionGroup } from "~/types";
import PermissionCheckItem from "./PermissionCheckItem";

interface PermissionGroupListProps {
  group: Pick<PermissionGroup, "id" | "name">;
  permissions: Permission[];
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
 * Component to display a group of permissions in a collapsible section
 */
const PermissionGroupList = ({
  group,
  permissions,
  selectedRoleId,
  rolePermissions,
  togglePermission,
}: PermissionGroupListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Skip rendering if there are no permissions
  if (permissions.length === 0) return null;

  const selectedRolePerms = selectedRoleId ? rolePermissions[selectedRoleId] : null;

  // Check if all permissions in this group are checked
  const allSelected =
    !!selectedRoleId &&
    !!selectedRolePerms &&
    permissions.every((permission) => {
      const permKey = `${permission.action}:${permission.resource}`;
      return (
        selectedRolePerms.direct.has(permKey) ||
        selectedRolePerms.inherited.has(permKey)
      );
    });

  // Check if some but not all permissions are selected
  const someSelected =
    !allSelected &&
    !!selectedRoleId &&
    !!selectedRolePerms &&
    permissions.some((permission) => {
      const permKey = `${permission.action}:${permission.resource}`;
      return (
        selectedRolePerms.direct.has(permKey) ||
        selectedRolePerms.inherited.has(permKey)
      );
    });

  // Handle selecting/deselecting all permissions in the group
  const handleSelectAll = () => {
    if (!selectedRoleId) return;

    permissions.forEach((permission) => {
      // Skip permissions that are already inherited
      const permKey = `${permission.action}:${permission.resource}`;
      if (selectedRolePerms?.inherited.has(permKey)) return;

      // Only toggle permissions that don't match our target state
      if (allSelected && selectedRolePerms?.direct.has(permKey)) {
        togglePermission(permission.id!);
      } else if (!allSelected && !selectedRolePerms?.direct.has(permKey)) {
        togglePermission(permission.id!);
      }
    });
  };

  return (
    <div className="mb-6 rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="flex items-center gap-3">
            <Checkbox
              id={`group-${group.id}`}
              checked={allSelected}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
              className={someSelected ? "data-[state=checked]:bg-orange-500" : ""}
              disabled={!selectedRoleId}
            />
            <label
              htmlFor={`group-${group.id}`}
              className="text-base font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {group.name}
            </label>
            <Badge variant="secondary" className="ml-2">
              {permissions.length}
            </Badge>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t bg-slate-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <div className="space-y-2 py-1">
            {permissions.map((permission) => (
              <PermissionCheckItem
                key={permission.id}
                permission={permission}
                selectedRoleId={selectedRoleId}
                rolePermissions={rolePermissions}
                togglePermission={togglePermission}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PermissionGroupList;