// PermissionAssignmentDialog.tsx
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Permission, type PermissionGroup, type Role } from "~/types";
import PermissionGroupList from "./PermissionGroupList";

interface PermissionAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
  permissionGroups: PermissionGroup[];
  selectedRole: Role | null;
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
  onSave: () => Promise<void>;
  isLoading: boolean;
  saveSuccess: boolean | null;
}

/**
 * Dialog component for assigning permissions to a role
 */
export const PermissionAssignmentDialog = ({
  open,
  onOpenChange,
  permissions,
  permissionGroups,
  selectedRole,
  rolePermissions,
  togglePermission,
  onSave,
  isLoading,
  saveSuccess,
}: PermissionAssignmentDialogProps) => {
  // Group permissions by their group
  const permissionsByGroup: Record<string, Permission[]> = {};
  
  // Add group for permissions without a groupId
  permissionsByGroup["ungrouped"] = [];
  
  // Initialize all groups with empty arrays
  permissionGroups.forEach((group) => {
    permissionsByGroup[group.id] = [];
  });
  
  // Populate groups with permissions
  permissions.forEach((permission) => {
    if (permission.groupId && permissionsByGroup[permission.groupId]) {
      permissionsByGroup[permission.groupId].push(permission);
    } else {
      permissionsByGroup["ungrouped"].push(permission);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold">
            Manage Permissions for {selectedRole?.name}
          </DialogTitle>
          <DialogDescription>
            Select the permissions you want to assign to this role. Inherited permissions are automatically granted.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] p-6 pt-2">
          {permissionGroups.map((group) => (
            <PermissionGroupList
              key={group.id}
              group={group}
              permissions={permissionsByGroup[group.id] || []}
              selectedRoleId={selectedRole?.id || null}
              rolePermissions={rolePermissions}
              togglePermission={togglePermission}
            />
          ))}

          {permissionsByGroup["ungrouped"].length > 0 && (
            <PermissionGroupList
              group={{ id: "ungrouped", name: "Ungrouped" }}
              permissions={permissionsByGroup["ungrouped"]}
              selectedRoleId={selectedRole?.id || null}
              rolePermissions={rolePermissions}
              togglePermission={togglePermission}
            />
          )}
        </ScrollArea>

        <DialogFooter className="flex items-center gap-2 border-t p-4">
          {saveSuccess === true && (
            <div className="mr-auto flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Permissions saved successfully</span>
            </div>
          )}

          {saveSuccess === false && (
            <div className="mr-auto flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to save permissions</span>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={onSave} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};