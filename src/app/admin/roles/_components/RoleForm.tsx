"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { Role } from "~/types";

interface RoleFormProps {
  roles: Role[];
  editMode: boolean;
  initialName?: string;
  initialParentId?: string | null;
  currentRoleId?: string | null;
  onSubmit: (name: string, parentId: string | null) => void;
}

export default function RoleForm({
  roles,
  editMode,
  initialName = "",
  initialParentId = null,
  currentRoleId = null,
  onSubmit,
}: RoleFormProps) {
  const [roleName, setRoleName] = useState(initialName);
  const [roleDescription, setRoleDescription] = useState("");
  const [parentId, setParentId] = useState<string | null>(initialParentId);
  const [error, setError] = useState("");

  useEffect(() => {
    setRoleName(initialName);
    setRoleDescription("");
    setParentId(initialParentId);
    setError("");
  }, [initialName, initialParentId]);

  const validateForm = () => {
    if (!roleName.trim()) {
      setError("Role name cannot be empty");
      return false;
    }
    const nameExists = roles.some(
      (role) =>
        role.name.toLowerCase() === roleName.toLowerCase() &&
        role.id !== currentRoleId,
    );
    if (nameExists) {
      setError("Role name must be unique");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(roleName.trim(), parentId);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="roleName" className="text-gray-700 dark:text-gray-300">
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
          htmlFor="roleDescription"
          className="text-gray-700 dark:text-gray-300"
        >
          Description (optional)
        </Label>
        <Input
          id="roleDescription"
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          placeholder="Enter role description"
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
        <Select onValueChange={setParentId} value={parentId ?? ""}>
          <SelectTrigger
            id="parentRole"
            className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
            <SelectItem
              value={null as unknown as string}
              className="text-gray-900 dark:text-gray-200"
            >
              None
            </SelectItem>
            {roles
              .filter((role) => role.id !== currentRoleId)
              .map((role) => (
                <SelectItem key={role.id} value={role.id!}>
                  {role.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {editMode ? "Update Role" : "Create Role"}
      </Button>
    </div>
  );
}
