// useRoles.ts
"use client";

import { useState } from "react";
import type { Role } from "~/types";
import { RoleService } from "../services/RoleService";

/**
 * Custom hook for managing roles
 * Provides state and operations for role management
 */
export function useRoles(initialRoles: Role[]) {
  // State for roles data
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Open dialog for creating a new role
  const openCreateDialog = () => {
    setCurrentRole(null);
    setEditMode(false);
    setDialogOpen(true);
  };

  // Open dialog for editing an existing role
  const openEditDialog = (role: Role) => {
    setCurrentRole(role);
    setEditMode(true);
    setDialogOpen(true);
  };

  // Create a new role or update an existing one
  const createOrUpdateRole = async (
    name: string,
    parentId: string | null,
    description?: string,
  ) => {
    setIsLoading(true);
    try {
      if (editMode && currentRole?.id) {
        // Update existing role using RoleService
        const success = await RoleService.updateRole(
          currentRole.id,
          name,
          parentId,
          description ?? "",
        );

        if (!success) {
          throw new Error("Failed to update role");
        }

        // Update local state with the updated role
        const updatedRole = {
          ...currentRole,
          name,
          parentId,
          description: description ?? "",
        };

        setRoles(
          roles.map((role) =>
            role.id === currentRole.id ? updatedRole : role,
          ),
        );
      } else {
        // Create new role using RoleService
        const newRole = await RoleService.createRole(
          name,
          parentId,
          description ?? "",
        );

        if (!newRole) {
          throw new Error("Failed to create role");
        }

        setRoles([...roles, newRole]);
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating/updating role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a role
  const deleteRole = async (roleId: string) => {
    setIsLoading(true);
    try {
      // Delete role using RoleService
      const success = await RoleService.deleteRole(roleId);

      if (!success) {
        throw new Error("Failed to delete role");
      }

      // Update local state by removing the deleted role
      setRoles(roles.filter((role) => role.id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setCurrentRole(null);
    setEditMode(false);
  };

  return {
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
    resetForm,
  };
}
