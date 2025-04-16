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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Role } from "~/types";

interface RoleFormProps {
  roles: Role[];
  editMode: boolean;
  initialName?: string;
  initialParentId?: string | null;
  initialDescription?: string;
  currentRoleId?: string | null;
  onSubmit: (
    name: string,
    parentId: string | null,
    description: string,
  ) => void;
  isLoading?: boolean;
}

export default function RoleForm({
  roles,
  editMode,
  initialName = "",
  initialParentId = null,
  initialDescription = "",
  currentRoleId = null,
  onSubmit,
  isLoading = false,
}: RoleFormProps) {
  const [roleName, setRoleName] = useState(initialName);
  const [roleDescription, setRoleDescription] = useState(initialDescription);
  const [parentId, setParentId] = useState<string | null>(initialParentId);
  const [error, setError] = useState("");
  const [rolesList, setRolesList] = useState<Role[]>(roles);

  useEffect(() => {
    setRoleName(initialName);
    setRoleDescription(initialDescription);
    setParentId(initialParentId);
    setRolesList(roles);
    setError("");
  }, [initialName, initialParentId, initialDescription, roles]);

  const validateForm = () => {
    if (!roleName.trim()) {
      setError("Role name cannot be empty");
      return false;
    }

    console.log("Validating role name:", roleName);
    console.log("rolesList rolesList:", rolesList);

    const nameExists = rolesList.some(
      (role) =>
        role?.name.toLowerCase() === roleName.toLowerCase() &&
        role?.id !== currentRoleId,
    );
    if (nameExists) {
      setError("Role name must be unique");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit(roleName.trim(), parentId, roleDescription.trim());
  };

  const handleParentChange = (value: string) => {
    // If "none" is selected, set parentId to null
    setParentId(value === "none" ? null : value);
  };

  return (
    <div className="grid gap-5 py-4">
      <div className="grid gap-2">
        <Label htmlFor="roleName" className="text-gray-700 dark:text-gray-300">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter role name"
          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        />
        {error && error.includes("name") && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="roleDescription"
          className="text-gray-700 dark:text-gray-300"
        >
          Description
        </Label>
        <Textarea
          id="roleDescription"
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          placeholder="Enter a description for this role"
          className="min-h-[100px] resize-y border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      <div className="grid gap-2">
        <Label
          htmlFor="parentRole"
          className="text-gray-700 dark:text-gray-300"
        >
          Parent Role
        </Label>

        <Select onValueChange={handleParentChange} value={parentId ?? "none"}>
          <SelectTrigger
            id="parentRole"
            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
            <SelectItem value="none">None</SelectItem>
            {rolesList
              .filter((role) => role.id !== currentRoleId)
              .map((role) => (
                <SelectItem key={role.id} value={role.id!}>
                  {role.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {error && !error.includes("name") && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {editMode ? "Updating..." : "Creating..."}
          </>
        ) : editMode ? (
          "Update Role"
        ) : (
          "Create Role"
        )}
      </Button>
    </div>
  );
}
