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
import { ChevronRight, Edit, PlusCircle, Trash2, UserCog } from "lucide-react";
import { useEffect, useState } from "react";

const fetchRoles = async () => [
  { id: "1", name: "admin", parentId: null, userCount: 10 },
  { id: "2", name: "editor", parentId: "1", userCount: 5 },
  { id: "3", name: "moderator", parentId: "2", userCount: 3 },
  { id: "4", name: "premium-user", parentId: "3", userCount: 2 },
  { id: "5", name: "user", parentId: "4", userCount: 50 },
];

export default function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [parentId, setParentId] = useState(null);
  const [error, setError] = useState("");
  const [expandedRoles, setExpandedRoles] = useState(new Set());

  useEffect(() => {
    fetchRoles().then(setRoles);
  }, []);

  const resetForm = () => {
    setEditMode(false);
    setCurrentRoleId(null);
    setRoleName("");
    setParentId(null);
    setError("");
  };

  const validateForm = () => {
    if (!roleName.trim()) {
      setError("Role name cannot be empty");
      return false;
    }
    if (
      roles.some(
        (role) =>
          role.name.toLowerCase() === roleName.toLowerCase() &&
          role.id !== currentRoleId,
      )
    ) {
      setError("Role name must be unique");
      return false;
    }
    return true;
  };

  const handleCreateOrUpdateRole = () => {
    if (!validateForm()) return;

    if (editMode) {
      const updatedRoles = roles.map((role) =>
        role.id === currentRoleId
          ? { ...role, name: roleName, parentId }
          : role,
      );
      setRoles(updatedRoles);
    } else {
      const newRole = {
        id: crypto.randomUUID(),
        name: roleName,
        parentId,
        userCount: 0, // New role has no users initially
      };
      setRoles([...roles, newRole]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEditRole = (role) => {
    setEditMode(true);
    setCurrentRoleId(role.id);
    setRoleName(role.name);
    setParentId(role.parentId);
    setDialogOpen(true);
  };

  const handleDeleteRole = (id) => {
    const updatedRoles = roles.filter(
      (role) => role.id !== id && role.parentId !== id,
    );
    setRoles(updatedRoles);
  };

  const toggleRoleExpansion = (roleId) => {
    const updatedExpandedRoles = new Set(expandedRoles);
    if (expandedRoles.has(roleId)) {
      updatedExpandedRoles.delete(roleId);
    } else {
      updatedExpandedRoles.add(roleId);
    }
    setExpandedRoles(updatedExpandedRoles);
  };

  const getLineColor = (depth) => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-yellow-500",
      "border-purple-500",
      "border-pink-500",
      "border-red-500",
      "border-teal-500",
      "border-orange-500",
      "border-gray-500",
    ];
    return colors[depth % colors.length];
  };

  const renderRoleTree = (parentId = null, depth = 0) => {
    return roles
      .filter((role) => role.parentId === parentId)
      .map((role) => (
        <div
          key={role.id}
          className={`ml-6 ${getLineColor(depth)} border-l-2 py-1 pl-4`}
        >
          <div className="group flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleRoleExpansion(role.id)}
                className="text-gray-500 dark:text-gray-400"
              >
                <ChevronRight
                  className={`h-4 w-4 ${expandedRoles.has(role.id) ? "rotate-90" : ""}`}
                />
              </button>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {role.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({role.userCount} users)
              </span>
            </div>
            <div className="flex gap-2 opacity-40 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => handleEditRole(role)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                onClick={() => handleDeleteRole(role.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {expandedRoles.has(role.id) && renderRoleTree(role.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          <UserCog className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Role Management
        </h1>
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
              className="border-none bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg bg-white shadow-xl sm:max-w-[425px] dark:bg-gray-800">
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              {editMode ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="roleName"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Name
                </Label>
                <Input
                  id="roleName"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Enter role name"
                  className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="parentRole"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Parent Role
                </Label>
                <Select onValueChange={setParentId} value={parentId}>
                  <SelectTrigger
                    id="parentRole"
                    className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                    <SelectItem
                      value={null}
                      className="text-gray-900 hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-indigo-900"
                    >
                      None
                    </SelectItem>
                    {roles
                      .filter((role) => role.id !== currentRoleId)
                      .map((role) => (
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
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
              <Button
                onClick={handleCreateOrUpdateRole}
                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {editMode ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <CardContent>
          <ScrollArea className="h-[500px] p-6">
            {roles.length > 0 ? (
              renderRoleTree()
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No roles available. Create one to get started!
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
