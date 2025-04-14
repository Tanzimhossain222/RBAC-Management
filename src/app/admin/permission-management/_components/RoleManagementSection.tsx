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
import { Lock, Shield } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import type { Permission, PermissionGroup, Role } from "~/types";

type RolePermissions = Record<
  string,
  {
    direct: Set<string>;
    inherited: Map<
      string,
      { id: string; sourceRoleId: string; sourceRoleName: string }
    >;
  }
>;

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
  setDialogOpen,
  dialogOpen,
  handleRoleSelect,
  selectedRoleId,
  togglePermission,
  handleSave,
}: RoleManagementSectionProps) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="flex items-center gap-2 text-4xl font-bold text-gray-100">
        <Shield className="h-8 w-8 text-indigo-400" />
        Role & Permission Management
      </h1>
      <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
        <DialogTrigger asChild>
          <Button className="border-none bg-indigo-600 text-white hover:bg-indigo-700">
            <Lock className="mr-2 h-4 w-4" />
            Assign Permissions
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg border-none bg-gray-700 text-gray-100 sm:max-w-[500px]">
          <DialogTitle className="text-gray-100">
            Assign Permissions to Role
          </DialogTitle>
          <div className="space-y-6 py-4">
            <div className="mb-4">
              <Label htmlFor="roleSelect" className="text-gray-300">
                Select Role
              </Label>
              <Select
                onValueChange={handleRoleSelect}
                value={selectedRoleId ?? ""}
              >
                <SelectTrigger
                  id="roleSelect"
                  className="border-gray-600 bg-gray-800 text-gray-100 focus:ring-indigo-500"
                >
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="border-gray-600 bg-gray-800 text-gray-100">
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id!}
                      className="text-gray-100 hover:bg-indigo-900"
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
                    <h3 className="flex items-center gap-2 font-semibold text-gray-100">
                      {group.name}
                    </h3>
                    <div className="mt-2 grid gap-3">
                      {permissions
                        .filter((permission) => permission.groupId === group.id)
                        .map((permission) => {
                          const inheritedEntry = rolePermissions[
                            selectedRoleId
                          ]?.inherited.get(permission.id!);
                          const isInherited =
                            inheritedEntry &&
                            inheritedEntry.sourceRoleId !== selectedRoleId;
                          const sourceRole = inheritedEntry?.sourceRoleName;
                          const permKey = `${permission.action}:${permission.resource}`;
                          const isChecked =
                            rolePermissions[selectedRoleId]?.direct.has(
                              permKey,
                            ) ?? isInherited;

                          return (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3"
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() =>
                                  !isInherited &&
                                  togglePermission(permission.id!)
                                }
                                disabled={isInherited}
                                className={isInherited ? "opacity-50" : ""}
                              />
                              <span
                                className={`text-gray-300 ${isInherited ? "italic" : ""}`}
                              >
                                {permission.name}
                                {isInherited && sourceRole && (
                                  <span className="ml-2 text-sm text-gray-400">
                                    (Inherited from {sourceRole})
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Please select a role to assign permissions.
              </p>
            )}

            <Button
              onClick={handleSave}
              disabled={!selectedRoleId}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
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
