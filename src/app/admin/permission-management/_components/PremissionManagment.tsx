"use client";

import { useEffect, useState } from "react";
import RoleCards from "./RoleCards";
import RoleManagementSection from "./RoleManagementSection";

// Define types
type Role = {
  id: string;
  name: string;
  parentId: string | null;
  permissions: Permission[];
};

type PermissionGroup = {
  id: string;
  name: string;
};

type Permission = {
  id: string;
  name: string;
  action: string;
  resource: string;
  groupId: string;
};

type RolePermissions = Record<string, Set<string>>;

// Props type for the component
interface PermissionManagementProps {
  permissionsData: Permission[];
  rolesData: Role[];
  permissionGroupsData: PermissionGroup[];
}

export default function PermissionManagement({
  permissionsData,
  rolesData,
  permissionGroupsData,
}: PermissionManagementProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    [],
  );
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setRoles(rolesData || []);
    setPermissionGroups(permissionGroupsData || []);
    setPermissions(permissionsData || []);

    // Pre-fill rolePermissions
    const initialPermissions: RolePermissions = {};
    rolesData.forEach((role) => {
      const permissionIds = role.permissions?.map((perm) => perm.id) || [];
      initialPermissions[role.id] = new Set(permissionIds);
    });

    setRolePermissions(initialPermissions);
  }, [rolesData, permissionGroupsData, permissionsData]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    if (!rolePermissions[roleId]) {
      setRolePermissions((prev) => ({
        ...prev,
        [roleId]: new Set<string>(),
      }));
    }
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRoleId) return;

    const updatedPermissions = new Set<string>(rolePermissions[selectedRoleId]);
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

  const handleSave = async () => {
    if (!selectedRoleId) return;
    console.log(
      "Assigned Permissions for Role:",
      selectedRoleId,
      rolePermissions[selectedRoleId],
    );

    const res = await fetch(`/api/roles/${selectedRoleId}/permissions`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        permissions: Array.from(rolePermissions[selectedRoleId]),
      }),
    });

    if (!res.ok) {
      console.error("Failed to update permissions");
      return;
    }
    const data = await res.json();
    console.log("Permissions updated successfully:", data);

    setDialogOpen(false);
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-6 dark:bg-gray-900">
      {/* Title and Role Management Section */}
      <RoleManagementSection
        roles={roles}
        setRolePermissions={setRolePermissions}
        setDialogOpen={setDialogOpen}
        dialogOpen={dialogOpen}
        handleRoleSelect={handleRoleSelect}
        handleSave={handleSave}
        permissionGroups={permissionGroups}
        permissions={permissions}
        rolePermissions={rolePermissions}
        selectedRoleId={selectedRoleId}
        togglePermission={togglePermission}
      />

      {/* Role Cards Display */}
      <RoleCards
        permissions={permissions}
        rolePermissions={rolePermissions}
        roles={roles}
        setDialogOpen={setDialogOpen}
        setSelectedRoleId={setSelectedRoleId}
      />
    </div>
  );
}
