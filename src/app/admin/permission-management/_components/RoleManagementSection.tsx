"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lock, Shield, UserCog } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

// Define types
type Role = {
  id: string;
  name: string;
  parentId: string | null;
};

type PermissionGroup = {
  id: string;
  name: string;
};

type Permission = {
  id: string;
  name: string;
  action: string;
  resource: string;
  groupId: string;
};

type RolePermissions = Record<string, Set<string>>;

// Props interface
interface RoleManagementSectionProps {
  roles: Role[];
  permissionGroups: PermissionGroup[];
  permissions: Permission[];
  rolePermissions: RolePermissions;
  setRolePermissions: Dispatch<SetStateAction<RolePermissions>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  dialogOpen: boolean;
  handleRoleSelect: (roleId: string) => void;
  selectedRoleId: string | null;
  togglePermission: (permissionId: string) => void;
  handleSave: () => void;
}

const RoleManagementSection = ({
  roles,
  permissionGroups,
  permissions,
  rolePermissions,
  setRolePermissions,
  setDialogOpen,
  dialogOpen,
  handleRoleSelect,
  selectedRoleId,
  togglePermission,
  handleSave,
}: RoleManagementSectionProps) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="flex items-center gap-2 text-4xl font-bold text-gray-900 dark:text-gray-100">
        <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        Role & Permission Management
      </h1>
      <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-none bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Lock className="mr-2 h-4 w-4" />
            Assign Permissions
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg bg-white shadow-xl sm:max-w-[500px] dark:bg-gray-800">
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Assign Permissions to Role
          </DialogTitle>
          <div className="space-y-6 py-4">
            <div className="mb-4">
              <Label
                htmlFor="roleSelect"
                className="text-gray-700 dark:text-gray-300"
              >
                Select Role
              </Label>
              <Select
                onValueChange={handleRoleSelect}
                value={selectedRoleId ?? ""}
              >
                <SelectTrigger
                  id="roleSelect"
                  className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                >
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id}
                      className="text-gray-900 hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-indigo-900"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoleId ? (
              <div className="grid max-h-[400px] gap-6 overflow-y-auto pr-4">
                {permissionGroups.map((group) => (
                  <div key={group.id}>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                      <UserCog className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      {group.name}
                    </h3>
                    <div className="mt-2 grid gap-3">
                      {permissions
                        .filter((permission) => permission.groupId === group.id)
                        .map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              checked={
                                rolePermissions[selectedRoleId]?.has(
                                  permission.id,
                                ) ?? false
                              }
                              onCheckedChange={() =>
                                togglePermission(permission.id)
                              }
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {permission.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Please select a role to assign permissions.
              </p>
            )}

            <Button
              onClick={handleSave}
              disabled={!selectedRoleId}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Save Permissions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagementSection;
