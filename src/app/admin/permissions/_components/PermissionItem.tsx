// permissions/_components/PermissionItem.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { type Permission, type PermissionGroup } from "./types";

interface PermissionItemProps {
  permission: Permission;
  group: PermissionGroup | undefined;
  onEdit: (permission: Permission) => void;
  onDelete: (id: string) => void;
}

/**
 * Component for displaying a single permission item
 */
const PermissionItem = ({
  permission,
  group,
  onEdit,
  onDelete,
}: PermissionItemProps) => {
  return (
    <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{permission.name}</h3>
          <Badge variant="outline">{group?.name || "Uncategorized"}</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {permission.description || "No description"}
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {permission.action}
          </Badge>
          <Badge variant="secondary">
            {permission.resource}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(permission)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(permission.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PermissionItem;
