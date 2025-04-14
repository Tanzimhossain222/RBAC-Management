// RoleManagerClient.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteMethod, postData, putData } from "~/lib/apiRequest";
import type { Role } from "~/types";
import CreateRoleDialog from "./CreateRoleDialog";
import RoleNodeTree from "./RoleTree";

export default function RoleManagerClient({ roleData }: { roleData: Role[] }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  useEffect(() => {
    if (roleData && roleData.length > 0) {
      setRoles(roleData);
    }
  }, [roleData]);

  const handleCreateOrUpdate = async (
    name: string,
    parentId: string | null,
  ) => {
    console.log("Creating or updating role:", {
      name,
      parentId,
    });

    if (editMode && currentRole) {
      const res = await putData({
        url: `/roles`,
        payload: {
          id: currentRole.id,
          name,
          parentId,
          description: "",
        },
      });

      const updated = roles.map((role) =>
        role.id === currentRole.id ? { ...role, name, parentId } : role,
      );
      setRoles(updated);
    } else {
      const res = (await postData({
        url: "/roles",
        payload: {
          name,
          parentId,
          description: "",
        },
      })) as Role;

      setRoles([...roles, res]);
    }
    resetForm();
  };

  const handleEdit = (role: Role) => {
    setEditMode(true);
    setCurrentRole(role);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteMethod({
      url: `/roles`,
      payload: { id },
    });

    console.log("Response from API:", res);

    const updated = roles.filter(
      (role) => role.id !== id && role.parentId !== id,
    );
    setRoles(updated);
  };

  const resetForm = () => {
    setDialogOpen(false);
    setEditMode(false);
    setCurrentRole(null);
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          <UserCog className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Role Management
        </h1>
        <CreateRoleDialog
          roles={roles}
          editMode={editMode}
          currentRole={currentRole}
          open={dialogOpen}
          onOpenChange={(open: boolean) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
          onSubmit={handleCreateOrUpdate}
        />
      </div>

      <Card className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <CardContent>
          <ScrollArea className="h-[500px] p-6">
            {roles.length > 0 ? (
              <RoleNodeTree
                roles={roles}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
