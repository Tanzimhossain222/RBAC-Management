// usePermissions.ts
import { useCallback, useEffect, useState } from "react";
import { PermissionService } from "../services/PermissionService";
import { type Permission, type PermissionGroup } from "../types";

/**
 * Custom hook for managing permissions state and operations
 */
export const usePermissions = (
  initialPermissions: Permission[],
  initialGroups: PermissionGroup[],
) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Permission dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPermissionId, setCurrentPermissionId] = useState<string | null>(
    null,
  );
  const [permissionName, setPermissionName] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Initialize data from props
  useEffect(() => {
    if (initialPermissions) {
      setPermissions(initialPermissions);
    }

    if (initialGroups) {
      setPermissionGroups(initialGroups);
    }
  }, [initialPermissions, initialGroups]);

  // Reset permission form state
  const resetPermissionForm = useCallback(() => {
    setEditMode(false);
    setCurrentPermissionId(null);
    setPermissionName("");
    setAction("");
    setResource("");
    setSelectedGroup(null);
    setError("");
    setPermissionDescription("");
  }, []);

  // Validation function
  const validatePermissionForm = useCallback(() => {
    if (
      !permissionName.trim() ||
      !action.trim() ||
      !resource.trim() ||
      !selectedGroup
    ) {
      setError("All fields, including group, are required.");
      return false;
    }

    return true;
  }, [permissionName, action, resource, selectedGroup]);

  // Open dialog for creating a new permission
  const openCreateDialog = useCallback(() => {
    resetPermissionForm();
    setDialogOpen(true);
  }, [resetPermissionForm]);

  // Open dialog for editing an existing permission
  const openEditDialog = useCallback((permission: Permission) => {
    setEditMode(true);
    setCurrentPermissionId(permission.id);
    setPermissionName(permission.name ?? "");
    setPermissionDescription(permission.description ?? "");
    setAction(permission.action);
    setResource(permission.resource);
    setSelectedGroup(permission.groupId);
    setDialogOpen(true);
  }, []);

  // Create or update a permission
  const createOrUpdatePermission = useCallback(async () => {
    if (!validatePermissionForm()) return;

    try {
      setIsLoading(true);
      if (editMode && currentPermissionId) {
        const success = await PermissionService.updatePermission({
          id: currentPermissionId,
          action,
          resource,
          name: permissionName,
          description: permissionDescription,
          groupId: selectedGroup!,
        });

        if (success) {
          setPermissions((prev) =>
            prev.map((perm) =>
              perm.id === currentPermissionId
                ? {
                    ...perm,
                    name: permissionName,
                    action,
                    resource,
                    description: permissionDescription,
                    groupId: selectedGroup!,
                  }
                : perm,
            ),
          );
        }
      } else {
        const newPermission = await PermissionService.createPermission({
          action,
          resource,
          description: permissionDescription,
          name: permissionName,
          groupId: selectedGroup!,
        });

        if (newPermission) {
          setPermissions((prev) => [...prev, newPermission]);
        }
      }

      setDialogOpen(false);
      resetPermissionForm();
    } catch (error) {
      console.error("Error handling permission:", error);
      setError("Failed to save permission");
    } finally {
      setIsLoading(false);
    }
  }, [
    validatePermissionForm,
    editMode,
    currentPermissionId,
    action,
    resource,
    permissionName,
    permissionDescription,
    selectedGroup,
    resetPermissionForm,
  ]);

  // Delete a permission
  const deletePermission = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const success = await PermissionService.deletePermission(id);

      if (success) {
        setPermissions((prev) => prev.filter((perm) => perm.id !== id));
      }
    } catch (error) {
      console.error("Error deleting permission:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get filtered permissions based on search query and group filter
  const getFilteredPermissions = useCallback(() => {
    return permissions.filter((permission) => {
      const matchesSearch =
        (permission.name?.toLowerCase() ?? "").includes(
          searchQuery.toLowerCase(),
        ) ||
        (permission.description?.toLowerCase() ?? "").includes(
          searchQuery.toLowerCase(),
        ) ||
        (permission.action?.toLowerCase() ?? "").includes(
          searchQuery.toLowerCase(),
        ) ||
        (permission.resource?.toLowerCase() ?? "").includes(
          searchQuery.toLowerCase(),
        );

      const matchesGroup =
        !selectedGroupFilter || permission.groupId === selectedGroupFilter;

      return matchesSearch && matchesGroup;
    });
  }, [permissions, searchQuery, selectedGroupFilter]);

  return {
    permissions,
    permissionGroups,
    searchQuery,
    setSearchQuery,
    selectedGroupFilter,
    setSelectedGroupFilter,
    isLoading,
    dialogOpen,
    setDialogOpen,
    editMode,
    permissionName,
    permissionDescription,
    action,
    resource,
    selectedGroup,
    error,
    openCreateDialog,
    openEditDialog,
    createOrUpdatePermission,
    deletePermission,
    resetPermissionForm,
    setPermissionName,
    setPermissionDescription,
    setAction,
    setResource,
    setSelectedGroup,
    getFilteredPermissions,
  };
};
