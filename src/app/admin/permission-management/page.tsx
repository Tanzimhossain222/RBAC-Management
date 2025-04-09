"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { CheckCircle, Lock, Shield, UserCog } from "lucide-react"; // Icons
import { useEffect, useState } from "react";

const fetchRoles = async () => [
  { id: "1", name: "admin", parentId: null },
  { id: "2", name: "editor", parentId: "1" },
  { id: "3", name: "moderator", parentId: "2" },
];

const fetchPermissionGroups = async () => [
  { id: "1", name: "User Management" },
  { id: "2", name: "Content Management" },
];

const fetchPermissions = async () => [
  {
    id: "1",
    name: "Create User",
    action: "create",
    resource: "user",
    groupId: "1",
  },
  {
    id: "2",
    name: "Edit User",
    action: "edit",
    resource: "user",
    groupId: "1",
  },
  {
    id: "3",
    name: "Create Post",
    action: "create",
    resource: "post",
    groupId: "2",
  },
  {
    id: "4",
    name: "Edit Post",
    action: "edit",
    resource: "post",
    groupId: "2",
  },
];

export default function PermissionManagementPage() {
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchRoles().then(setRoles);
    fetchPermissionGroups().then(setPermissionGroups);
    fetchPermissions().then(setPermissions);
  }, []);

  const handleRoleSelect = (roleId) => {
    setSelectedRoleId(roleId);
    if (!rolePermissions[roleId]) {
      setRolePermissions((prev) => ({
        ...prev,
        [roleId]: new Set(),
      }));
    }
  };

  const togglePermission = (permissionId) => {
    if (!selectedRoleId) return;

    const updatedPermissions = new Set(rolePermissions[selectedRoleId]);
    if (updatedPermissions.has(permissionId)) {
      updatedPermissions.delete(permissionId);
    } else {
      updatedPermissions.add(permissionId);
    }

    setRolePermissions((prev) => ({
      ...prev,
      [selectedRoleId]: updatedPermissions,
    }));
  };

  const handleSave = () => {
    console.log(
      "Assigned Permissions for Role:",
      selectedRoleId,
      rolePermissions[selectedRoleId],
    );
    setDialogOpen(false);
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-6 dark:bg-gray-900">
      {/* Title and Role Management Section */}
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
                          .filter(
                            (permission) => permission.groupId === group.id,
                          )
                          .map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3"
                            >
                              <Checkbox
                                checked={
                                  rolePermissions[selectedRoleId]?.has(
                                    permission.id,
                                  ) || false
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

      {/* Role Cards Display */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card
            key={role.id}
            className="rounded-lg border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <UserCog className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-gray-900 capitalize dark:text-gray-100">
                  {role.name}
                </h2>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Assigned Permissions:
                </p>
                {rolePermissions[role.id] &&
                rolePermissions[role.id].size > 0 ? (
                  <ul className="space-y-2">
                    {[...rolePermissions[role.id]].map((permissionId) => {
                      const permission = permissions.find(
                        (perm) => perm.id === permissionId,
                      );
                      return permission ? (
                        <li
                          key={permission.id}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {permission.name}
                        </li>
                      ) : null;
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic dark:text-gray-400">
                    No permissions assigned.
                  </p>
                )}
              </div>

              <Button
                onClick={() => {
                  setSelectedRoleId(role.id);
                  setDialogOpen(true);
                }}
                className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Manage Permissions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
