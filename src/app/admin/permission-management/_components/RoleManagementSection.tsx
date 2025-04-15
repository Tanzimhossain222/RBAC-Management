"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Lock, Search, Shield, XCircle } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
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
  isLoading?: boolean;
  saveSuccess?: boolean | null;
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
  isLoading = false,
  saveSuccess = null,
}: RoleManagementSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter permissions based on search term
  const filterPermissions = (permissions: Permission[]) => {
    if (!searchTerm) return permissions;
    return permissions.filter(
      (permission) =>
        permission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
          <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          Role & Permission Management
          <Badge
            variant="outline"
            className="ml-2 bg-indigo-100 px-2 text-xs text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
          >
            Admin
          </Badge>
        </h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 text-white shadow-md transition-all hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800">
              <Lock className="mr-2 h-4 w-4" />
              Assign Permissions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl rounded-lg border-none bg-white p-0 shadow-2xl dark:bg-gray-900">
            <DialogHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
              <DialogTitle className="text-xl font-bold text-white">
                Assign Permissions to Role
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 p-6">
              <div className="mb-4">
                <Label
                  htmlFor="roleSelect"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select Role
                </Label>
                <Select
                  onValueChange={handleRoleSelect}
                  value={selectedRoleId ?? ""}
                >
                  <SelectTrigger
                    id="roleSelect"
                    className="mt-1 w-full border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    {roles.map((role) => (
                      <SelectItem
                        key={role.id}
                        value={role.id!}
                        className="cursor-pointer dark:text-white"
                      >
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRoleId && (
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Search permissions..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {selectedRoleId ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {permissionGroups.map((group) => {
                      const filteredPermissions = filterPermissions(
                        permissions.filter(
                          (permission) => permission.groupId === group.id,
                        ),
                      );

                      if (filteredPermissions.length === 0) return null;

                      return (
                        <div
                          key={group.id}
                          className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <h3 className="mb-3 font-semibold text-gray-800 dark:text-gray-200">
                            {group.name}
                          </h3>
                          <div className="grid gap-2">
                            {filteredPermissions.map((permission) => {
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
                                  className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() =>
                                      !isInherited &&
                                      togglePermission(permission.id!)
                                    }
                                    disabled={isInherited}
                                    className={isInherited ? "opacity-60" : ""}
                                  />
                                  <div className="flex flex-1 flex-col">
                                    <span
                                      className={`font-medium ${isInherited ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
                                    >
                                      {permission.name}
                                    </span>
                                    {permission.description && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {permission.description}
                                      </span>
                                    )}
                                  </div>
                                  {isInherited && sourceRole && (
                                    <Badge
                                      variant="outline"
                                      className="ml-auto flex-shrink-0 text-xs"
                                    >
                                      From {sourceRole}
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex h-20 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Please select a role to assign permissions
                  </p>
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={!selectedRoleId || isLoading}
                className="mt-4 w-full bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-800"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : saveSuccess === true ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Saved Successfully!
                  </span>
                ) : saveSuccess === false ? (
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Failed to Save
                  </span>
                ) : (
                  "Save Permissions"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Manage role permissions and access control for your application
      </p>
    </div>
  );
};

export default RoleManagementSection;
