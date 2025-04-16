// PermissionManagement.tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { type Permission, type PermissionGroup, type Role } from "~/types";
import { useRolePermissions } from "./hooks/useRolePermissions";
import { PermissionAssignmentDialog } from "./PermissionAssignmentDialog";
import RoleCardsGrid from "./RoleCardsGrid";
import { Shield } from "lucide-react";

interface PermissionManagementProps {
  permissionsData: Permission[];
  rolesData: Role[];
  permissionGroupsData: PermissionGroup[];
  rolePermissionsData: Record<
    string,
    {
      direct: string[];
      inherited: Array<{
        id: string;
        sourceRoleId: string;
        sourceRoleName: string;
      }>;
    }
  >;
}

/**
 * Main component for managing role permissions
 */
export default function PermissionManagement({
  permissionsData,
  rolesData,
  permissionGroupsData,
  rolePermissionsData,
}: PermissionManagementProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Use the custom hook to manage role permissions
  const {
    roles,
    permissions,
    selectedRoleId,
    rolePermissions,
    isLoading,
    saveSuccess,
    setSelectedRoleId,
    handleRoleSelect,
    togglePermission,
    saveRolePermissions,
    setSaveSuccess
  } = useRolePermissions(permissionsData, rolesData, rolePermissionsData);

  // Get the selected role object
  const selectedRole = selectedRoleId
    ? roles.find((role) => role.id === selectedRoleId)
    : null;

  // Handler for opening the permission management dialog
  const handleManagePermissions = (roleId: string) => {
    handleRoleSelect(roleId);
    setDialogOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="flex min-h-[calc(100vh-200px)] flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-4"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold">Role Permissions</h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage permissions for each role in your application. Click on a role to view and modify its permissions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pb-8"
        >
          <RoleCardsGrid
            roles={roles}
            rolePermissions={rolePermissions}
            permissions={permissions}
            onManagePermissions={handleManagePermissions}
          />
        </motion.div>
      </div>

      {/* Dialog for assigning permissions to a role */}
      <PermissionAssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permissions={permissions}
        permissionGroups={permissionGroupsData}
        selectedRole={selectedRole}
        rolePermissions={rolePermissions}
        togglePermission={togglePermission}
        onSave={saveRolePermissions}
        isLoading={isLoading}
        saveSuccess={saveSuccess}
      />
    </div>
  );
}
