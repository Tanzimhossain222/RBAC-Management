// PermissionManagement.tsx
"use client";

import { useEffect, useState } from "react";
import RoleCardsX from "./RoleCardsX";
import RoleManagementSection from "./RoleManagementSection";

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

type RolePermissions = Record<
  string,
  {
    direct: Set<string>;
    inherited: Map<
      string,
      { id: string; sourceRoleId: string; sourceRoleName: string }
    >;
  }
>;

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

export default function PermissionManagement({
  permissionsData,
  rolesData,
  permissionGroupsData,
  rolePermissionsData,
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

    // Normalize permission names (e.g., "Test" -> "Edit Post")
    const normalizedPermissions = permissionsData.map((perm) => ({
      ...perm,
      name:
        perm.action === "edit" && perm.resource === "post"
          ? "Edit Post"
          : perm.name,
    }));

    setPermissions(normalizedPermissions);

    // Initialize rolePermissions from props
    const initialPermissions: RolePermissions = {};
    for (const roleId in rolePermissionsData) {
      initialPermissions[roleId] = {
        direct: new Set(rolePermissionsData[roleId].direct),
        inherited: new Map(
          rolePermissionsData[roleId].inherited.map((entry) => [
            entry.id,
            {
              id: entry.id,
              sourceRoleId: entry.sourceRoleId,
              sourceRoleName: entry.sourceRoleName,
            },
          ]),
        ),
      };
    }
    setRolePermissions(initialPermissions);
  }, [rolesData, permissionGroupsData, permissionsData, rolePermissionsData]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    if (!rolePermissions[roleId]) {
      setRolePermissions((prev) => ({
        ...prev,
        [roleId]: { direct: new Set(), inherited: new Map() },
      }));
    }
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRoleId) return;

    const updatedDirect = new Set<string>(
      rolePermissions[selectedRoleId].direct,
    );
    const perm = permissions.find((p) => p.id === permissionId);
    if (!perm) return;
    const permKey = `${perm.action}:${perm.resource}`;

    if (updatedDirect.has(permKey)) {
      updatedDirect.delete(permKey);
    } else {
      updatedDirect.add(permKey);
    }

    setRolePermissions((prev) => ({
      ...prev,
      [selectedRoleId]: {
        ...prev[selectedRoleId],
        direct: updatedDirect,
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    console.log(
      "Assigned Permissions for Role:",
      selectedRoleId,
      rolePermissions[selectedRoleId],
    );

    const permissionIds = Array.from(rolePermissions[selectedRoleId].direct)
      .map((permKey) => {
        const [action, resource] = permKey.split(":");
        return permissions.find(
          (p) => p.action === action && p.resource === resource,
        )?.id;
      })
      .filter(Boolean) as string[];

    const res = await fetch(`/api/roles/${selectedRoleId}/permissions`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permissions: permissionIds }),
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
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-800 p-6">
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
      <RoleCardsX
        permissions={permissions}
        rolePermissions={rolePermissions}
        roles={roles}
        setDialogOpen={setDialogOpen}
        setSelectedRoleId={setSelectedRoleId}
      />
    </div>
  );
}
