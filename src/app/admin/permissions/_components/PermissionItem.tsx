// permissions/_components/PermissionItem.tsx
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { type Permission } from "./types";

interface PermissionItemProps {
  permission: Permission;
  onEdit: (permission: Permission) => void;
  onDelete: (id: string) => void;
}

export function PermissionItem({
  permission,
  onEdit,
  onDelete,
}: PermissionItemProps) {
  return (
    <div className="group flex w-full items-center justify-between overflow-hidden rounded-md bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-xs font-medium text-gray-900 dark:text-gray-200">
          {permission.name}
        </span>

        <span className="truncate text-sm text-gray-600 dark:text-gray-400">
          {`${permission.action} on ${permission.resource}`}
        </span>
      </div>
      <div className="flex flex-shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => onEdit(permission)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          onClick={() => onDelete(permission.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
