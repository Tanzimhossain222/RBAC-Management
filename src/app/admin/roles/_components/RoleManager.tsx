// RoleManager.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Shield, UserCog, Users } from "lucide-react";
import { useState } from "react";
import type { Role } from "~/types";
import CreateRoleDialog from "./CreateRoleDialog";
import { useRoles } from "./hooks/useRoles";
import { RoleDetailsView } from "./RoleDetailsView";
import { RoleHierarchyView } from "./RoleHierarchyView";

/**
 * Main component for managing roles
 */
export default function RoleManager({ roleData }: { roleData: Role[] }) {
  const [activeTab, setActiveTab] = useState("hierarchy");
  
  // Use the custom hook to manage role state and operations
  const {
    roles,
    currentRole,
    isLoading,
    editMode,
    dialogOpen,
    setDialogOpen,
    openCreateDialog,
    openEditDialog,
    createOrUpdateRole,
    deleteRole,
    resetForm
  } = useRoles(roleData);

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            <UserCog className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            Role Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your application roles and hierarchies
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Users className="mr-1 h-4 w-4" />
            {roles.length} Roles
          </Badge>
          <CreateRoleDialog
            roles={roles}
            editMode={editMode}
            currentRole={currentRole}
            open={dialogOpen}
            onOpenChange={(open: boolean) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
            onSubmit={createOrUpdateRole}
            isLoading={isLoading}
          />
        </div>
      </div>

      <Tabs
        defaultValue="hierarchy"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="hierarchy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Role Hierarchy
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Role Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy">
          <RoleHierarchyView 
            roles={roles}
            onEdit={openEditDialog}
            onDelete={deleteRole}
          />
        </TabsContent>

        <TabsContent value="info">
          <RoleDetailsView 
            roles={roles}
            onEdit={openEditDialog}
            onDelete={deleteRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
