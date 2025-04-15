// RolePermissionService.ts
/**
 * Service responsible for managing role-permission assignments
 */
export class RolePermissionService {
  /**
   * Updates the permissions assigned to a role
   */
  static async updateRolePermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/roles/${roleId}/permissions`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permissions: permissionIds }),
      });

      if (!response.ok) {
        console.error("Failed to update permissions");
        return false;
      }

      const data = await response.json();
      console.log("Permissions updated successfully:", data);
      return true;
    } catch (error) {
      console.error("Error updating permissions:", error);
      return false;
    }
  }
}