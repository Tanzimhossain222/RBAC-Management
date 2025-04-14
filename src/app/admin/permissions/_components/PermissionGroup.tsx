// permissions/_components/PermissionGroup.tsx
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { PermissionItem } from "./PermissionItem";
import { type Permission, type PermissionGroup } from "./types";

interface PermissionGroupProps {
  group: PermissionGroup;
  permissions: Permission[];
  onEditGroup: (group: PermissionGroup) => void;
  onDeleteGroup: (id: string) => void;
  onAddPermission: () => void;
  onEditPermission: (permission: Permission) => void;
  onDeletePermission: (id: string) => void;
}

export function PermissionGroup({
  group,
  permissions,
  onEditGroup,
  onDeleteGroup,
  onAddPermission,
  onEditPermission,
  onDeletePermission,
}: PermissionGroupProps) {
  return (
    <div className="mb-4 overflow-hidden">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
        <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-gray-100">
          {group.name}
        </h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => onEditGroup(group)} 
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            onClick={() => onDeleteGroup(group.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="ml-4">
        <Button
          variant="outline"
          className="mb-4 border-none bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          onClick={onAddPermission}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Permission
        </Button>

        <div className="mt-4 w-full space-y-3">
          {permissions
            .filter((perm) => perm.groupId === group.id)
            .map((perm) => (
              <PermissionItem
                key={perm.id}
                permission={perm}
                onEdit={onEditPermission}
                onDelete={onDeletePermission}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
