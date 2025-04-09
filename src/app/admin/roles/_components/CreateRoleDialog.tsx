"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import RoleForm from "./RoleForm";
import { type Role } from "./RoleNode";

interface CreateRoleDialogProps {
  roles: Role[];
  editMode: boolean;
  currentRole?: Role | null;
  onSubmit: (name: string, parentId: string | null) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export default function CreateRoleDialog({
  roles,
  editMode,
  currentRole,
  onSubmit,
  open,
  onOpenChange,
}: CreateRoleDialogProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    if (editMode && currentRole) {
      setName(currentRole.name);
      setParentId(currentRole.parentId ?? null);
    } else {
      setName("");
      setParentId(null);
    }
  }, [editMode, currentRole]);

  const handleSubmit = (roleName: string, parentId: string | null) => {
    onSubmit(roleName, parentId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <RoleForm
          roles={roles}
          editMode={editMode}
          initialName={name}
          initialParentId={parentId}
          currentRoleId={currentRole?.id ?? null}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
