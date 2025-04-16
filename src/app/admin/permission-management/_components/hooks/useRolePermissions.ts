// useRolePermissions.ts
import { useState, useEffect, useCallback } from "react";
import type { Permission, Role } from "~/types";
import { RolePermissionService } from "../services/RolePermissionService";

// Define the RolePermissions type
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

// Initial rolePermissionsData type from the server
type InitialRolePermissionsData = Record<
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

/**
 * Custom hook for managing role permissions state and operations
 */
export const useRolePermissions = (
  initialPermissions: Permission[],
  initialRoles: Role[],
  initialRolePermissionsData: InitialRolePermissionsData
) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  
  // Initialize data from props
  useEffect(() => {
    setRoles(initialRoles || []);

    // Normalize permission names
    const normalizedPermissions = initialPermissions.map((perm) => ({
      ...perm,
      name: perm.name || `${perm.action} ${perm.resource}`,
    }));

    setPermissions(normalizedPermissions);

    // Initialize rolePermissions from props
    const formattedPermissions: RolePermissions = {};
    for (const roleId in initialRolePermissionsData) {
      formattedPermissions[roleId] = {
        direct: new Set(initialRolePermissionsData[roleId]?.direct ?? []),
        inherited: new Map(
          initialRolePermissionsData[roleId]?.inherited?.map((entry) => [
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
    setRolePermissions(formattedPermissions);
  }, [initialRoles, initialPermissions, initialRolePermissionsData]);

  // Select a role
  const handleRoleSelect = useCallback((roleId: string) => {
    setSelectedRoleId(roleId);
    
    // Initialize role permissions if they don't exist
    if (!rolePermissions[roleId]) {
      setRolePermissions((prev) => ({
        ...prev,
        [roleId]: { direct: new Set(), inherited: new Map() },
      }));
    }
  }, [rolePermissions]);

  // Toggle a permission for the selected role
  const togglePermission = useCallback((permissionId: string) => {
    if (!selectedRoleId) return;

    const selectedRolePermissions = rolePermissions[selectedRoleId];
    if (!selectedRolePermissions) return;

    const updatedDirect = new Set<string>(selectedRolePermissions.direct);
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
        direct: updatedDirect,
        inherited: prev[selectedRoleId]?.inherited ?? new Map(),
      },
    }));
  }, [selectedRoleId, rolePermissions, permissions]);

  // Save role permissions changes
  const saveRolePermissions = useCallback(async () => {
    if (!selectedRoleId) return;

    setIsLoading(true);
    setSaveSuccess(null);

    const selectedRole = rolePermissions[selectedRoleId];
    const permissionIds = selectedRole
      ? (Array.from(selectedRole.direct)
          .map((permKey) => {
            const [action, resource] = permKey.split(":");
            return permissions.find(
              (p) => p.action === action && p.resource === resource,
            )?.id;
          })
          .filter(Boolean) as string[])
      : [];

    try {
      const success = await RolePermissionService.updateRolePermissions(
        selectedRoleId,
        permissionIds
      );

      setSaveSuccess(success);

      if (success) {
        // Auto-close after success
        setTimeout(() => {
          setSaveSuccess(null);
        }, 1500);
      }
    } catch (error) {
      console.error("Error in saveRolePermissions:", error);
      setSaveSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRoleId, rolePermissions, permissions]);

  return {
    roles,
    permissions,
    selectedRoleId,
    rolePermissions,
    isLoading,
    saveSuccess,
    setSelectedRoleId,
    setRolePermissions,
    handleRoleSelect,
    togglePermission,
    saveRolePermissions,
    setSaveSuccess
  };
};