"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { Edit, PlusCircle, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

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
    name: "Delete User",
    action: "delete",
    resource: "user",
    groupId: "1",
  },
  {
    id: "4",
    name: "Create Content",
    action: "create",
    resource: "content",
    groupId: "2",
  },
  {
    id: "5",
    name: "Edit Content",
    action: "edit",
    resource: "content",
    groupId: "2",
  },
];

export default function PermissionPage() {
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPermissionId, setCurrentPermissionId] = useState(null);
  const [permissionName, setPermissionName] = useState("");
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState("");
  const [dialogGroupOpen, setDialogGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    fetchPermissionGroups().then(setPermissionGroups);
    fetchPermissions().then(setPermissions);
  }, []);

  const resetForm = () => {
    setEditMode(false);
    setCurrentPermissionId(null);
    setPermissionName("");
    setAction("");
    setResource("");
    setSelectedGroup(null);
    setError("");
  };

  const resetGroupForm = () => {
    setGroupName("");
    setError("");
  };

  const validateForm = () => {
    if (
      !permissionName.trim() ||
      !action.trim() ||
      !resource.trim() ||
      !selectedGroup
    ) {
      setError("All fields, including group, are required.");
      return false;
    }
    if (
      permissions.some(
        (perm) =>
          perm.name.toLowerCase() === permissionName.toLowerCase() &&
          perm.id !== currentPermissionId,
      )
    ) {
      setError("Permission name must be unique");
      return false;
    }
    return true;
  };

  const validateGroupForm = () => {
    if (!groupName.trim()) {
      setError("Group name cannot be empty");
      return false;
    }
    if (
      permissionGroups.some(
        (group) => group.name.toLowerCase() === groupName.toLowerCase(),
      )
    ) {
      setError("Group name must be unique");
      return false;
    }
    return true;
  };

  const handleCreateOrUpdatePermission = () => {
    if (!validateForm()) return;

    if (editMode) {
      const updatedPermissions = permissions.map((perm) =>
        perm.id === currentPermissionId
          ? {
              ...perm,
              name: permissionName,
              action,
              resource,
              groupId: selectedGroup,
            }
          : perm,
      );
      setPermissions(updatedPermissions);
    } else {
      const newPermission = {
        id: crypto.randomUUID(),
        name: permissionName,
        action,
        resource,
        groupId: selectedGroup,
      };
      setPermissions([...permissions, newPermission]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleCreateGroup = () => {
    if (!validateGroupForm()) return;

    const newGroup = {
      id: crypto.randomUUID(),
      name: groupName,
    };
    setPermissionGroups([...permissionGroups, newGroup]);
    setDialogGroupOpen(false);
    resetGroupForm();
  };

  const handleEditPermission = (permission) => {
    setEditMode(true);
    setCurrentPermissionId(permission.id);
    setPermissionName(permission.name);
    setAction(permission.action);
    setResource(permission.resource);
    setSelectedGroup(permission.groupId);
    setDialogOpen(true);
  };

  const handleDeletePermission = (id) => {
    const updatedPermissions = permissions.filter((perm) => perm.id !== id);
    setPermissions(updatedPermissions);
  };

  const handleDeleteGroup = (id) => {
    const updatedGroups = permissionGroups.filter((group) => group.id !== id);
    const updatedPermissions = permissions.filter(
      (perm) => perm.groupId !== id,
    );
    setPermissionGroups(updatedGroups);
    setPermissions(updatedPermissions);
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Permission Management
        </h1>
        <Dialog
          open={dialogGroupOpen}
          onOpenChange={(open) => {
            setDialogGroupOpen(open);
            if (!open) resetGroupForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-none bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              Create Permission Group
            </DialogTitle>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="groupName"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Group Name
                </Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
              <Button
                onClick={handleCreateGroup}
                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Create Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-6">
          <ScrollArea className="max-h-[calc(100vh-200px)] w-full overflow-auto pr-4">
            {permissionGroups.length > 0 ? (
              permissionGroups.map((group) => (
                <div key={group.id} className="mb-4 overflow-hidden">
                  <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                    <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {group.name}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Dialog
                      open={dialogOpen}
                      onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) resetForm();
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="mb-4 border-none bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Permission
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
                        <DialogTitle className="text-gray-900 dark:text-gray-100">
                          {editMode ? "Edit Permission" : "Create Permission"}
                        </DialogTitle>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label
                              htmlFor="permissionName"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Permission Name
                            </Label>
                            <Input
                              id="permissionName"
                              value={permissionName}
                              onChange={(e) =>
                                setPermissionName(e.target.value)
                              }
                              placeholder="Enter permission name"
                              className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="action"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Action
                            </Label>
                            <Input
                              id="action"
                              value={action}
                              onChange={(e) => setAction(e.target.value)}
                              placeholder="e.g., create, edit, delete"
                              className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="resource"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Resource
                            </Label>
                            <Input
                              id="resource"
                              value={resource}
                              onChange={(e) => setResource(e.target.value)}
                              placeholder="e.g., user, content"
                              className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="group"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Group
                            </Label>
                            <Select
                              onValueChange={setSelectedGroup}
                              value={selectedGroup}
                            >
                              <SelectTrigger
                                id="group"
                                className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                              >
                                <SelectValue placeholder="Select a group" />
                              </SelectTrigger>
                              <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                {permissionGroups.map((group) => (
                                  <SelectItem
                                    key={group.id}
                                    value={group.id}
                                    className="text-gray-900 hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-indigo-900"
                                  >
                                    {group.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {error && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {error}
                            </p>
                          )}
                          <Button
                            onClick={handleCreateOrUpdatePermission}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                          >
                            {editMode
                              ? "Update Permission"
                              : "Create Permission"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="mt-4 w-full space-y-3">
                      {permissions
                        .filter((perm) => perm.groupId === group.id)
                        .map((perm) => (
                          <div
                            key={perm.id}
                            className="group flex w-full items-center justify-between overflow-hidden rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                          >
                            <div className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-200">
                                {perm.name}
                              </span>
                              <span className="truncate text-xs text-gray-600 dark:text-gray-400">{`${perm.action} on ${perm.resource}`}</span>
                            </div>
                            <div className="flex flex-shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={() => handleEditPermission(perm)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => handleDeletePermission(perm.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-gray-500 dark:text-gray-400">
                No permission groups available. Create one to get started!
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
