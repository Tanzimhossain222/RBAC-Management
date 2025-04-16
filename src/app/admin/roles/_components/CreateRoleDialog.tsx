"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Role } from "~/types";
import RoleForm from "./RoleForm";

interface CreateRoleDialogProps {
  roles: Role[];
  editMode: boolean;
  currentRole?: Role | null;
  onSubmit: (
    name: string,
    parentId: string | null,
    description?: string,
  ) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  isLoading?: boolean;
}

export default function CreateRoleDialog({
  roles,
  editMode,
  currentRole,
  onSubmit,
  open,
  onOpenChange,
  isLoading = false,
}: CreateRoleDialogProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editMode && currentRole) {
      setName(currentRole.name);
      setParentId(currentRole.parentId ?? null);
      setDescription(currentRole.description || "");
    } else {
      setName("");
      setParentId(null);
      setDescription("");
    }
  }, [editMode, currentRole]);

  const handleSubmit = (
    roleName: string,
    parentId: string | null,
    description: string,
  ) => {
    console.log("Submitting role with data:", {
      roleName,
      parentId,
      description,
    });

    onSubmit(roleName, parentId, description);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          {editMode ? "Edit Role" : "Create Role"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {editMode ? "Edit Role" : "Create New Role"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {editMode
              ? "Update the role details below"
              : "Fill out the form below to create a new role"}
          </DialogDescription>
        </DialogHeader>
        <RoleForm
          roles={roles}
          editMode={editMode}
          initialName={name}
          initialParentId={parentId}
          initialDescription={description}
          currentRoleId={currentRole?.id ?? null}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
