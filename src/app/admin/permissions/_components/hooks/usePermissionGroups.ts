// usePermissionGroups.ts
import { useCallback, useEffect, useState } from "react";
import { PermissionService } from "../services/PermissionService";
import { type PermissionGroup } from "../types";

/**
 * Custom hook for managing permission groups state and operations
 */
export const usePermissionGroups = (initialGroups: PermissionGroup[]) => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  // Group dialog state
  const [dialogGroupOpen, setDialogGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [editGroupMode, setEditGroupMode] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Initialize data from props
  useEffect(() => {
    if (initialGroups) {
      setPermissionGroups(initialGroups);
    }
  }, [initialGroups]);

  // Reset group form state
  const resetGroupForm = useCallback(() => {
    setGroupName("");
    setGroupDescription("");
    setError("");
    setEditGroupMode(false);
    setCurrentGroupId(null);
  }, []);

  // Validation function
  const validateGroupForm = useCallback(() => {
    if (!groupName.trim()) {
      setError("Group name cannot be empty");
      return false;
    }

    if (
      editGroupMode &&
      currentGroupId &&
      permissionGroups.some(
        (group) =>
          group.name.toLowerCase() === groupName.toLowerCase() &&
          group.id !== currentGroupId,
      )
    ) {
      setError("Group name must be unique");
      return false;
    }

    if (
      !editGroupMode &&
      permissionGroups.some(
        (group) => group.name.toLowerCase() === groupName.toLowerCase(),
      )
    ) {
      setError("Group name must be unique");
      return false;
    }

    return true;
  }, [groupName, permissionGroups, editGroupMode, currentGroupId]);

  // Open dialog for creating a new group
  const openAddGroupDialog = useCallback(() => {
    resetGroupForm();
    setDialogGroupOpen(true);
  }, [resetGroupForm]);

  // Open dialog for editing an existing group
  const openEditGroupDialog = useCallback((group: PermissionGroup) => {
    setEditGroupMode(true);
    setCurrentGroupId(group.id);
    setGroupName(group.name);
    setGroupDescription(group.description ?? "");
    setDialogGroupOpen(true);
  }, []);

  // Create or update a permission group
  const createOrUpdateGroup = useCallback(async () => {
    if (!validateGroupForm()) return;

    try {
      setIsLoading(true);
      if (editGroupMode && currentGroupId) {
        const success = await PermissionService.updatePermissionGroup(
          currentGroupId,
          {
            name: groupName,
            description: groupDescription,
          },
        );

        if (success) {
          setPermissionGroups((prev) =>
            prev.map((group) =>
              group.id === currentGroupId
                ? {
                    ...group,
                    name: groupName,
                    description: groupDescription,
                  }
                : group,
            ),
          );
        }
      } else {
        const newGroup = await PermissionService.createPermissionGroup({
          name: groupName,
          description: groupDescription,
        });

        if (newGroup) {
          setPermissionGroups((prev) => [...prev, newGroup]);
        }
      }

      setDialogGroupOpen(false);
      resetGroupForm();
    } catch (error) {
      console.error("Error handling group:", error);
      setError("Failed to save group");
    } finally {
      setIsLoading(false);
    }
  }, [
    validateGroupForm,
    editGroupMode,
    currentGroupId,
    groupName,
    groupDescription,
    resetGroupForm,
  ]);

  // Delete a permission group
  const deleteGroup = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const success = await PermissionService.deletePermissionGroup(id);

      if (success) {
        setPermissionGroups((prev) => prev.filter((group) => group.id !== id));
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    permissionGroups,
    isLoading,
    dialogGroupOpen,
    setDialogGroupOpen,
    groupName,
    setGroupName,
    groupDescription,
    setGroupDescription,
    editGroupMode,
    error,
    openAddGroupDialog,
    openEditGroupDialog,
    createOrUpdateGroup,
    deleteGroup,
    resetGroupForm,
  };
};
