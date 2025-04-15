// PermissionService.ts
import {
  deleteData,
  deleteMethod,
  patchData,
  postData,
} from "~/lib/apiRequest";
import { type Permission, type PermissionGroup } from "../types";

/**
 * Service responsible for Permission-related API operations
 */
export class PermissionService {
  /**
   * Creates a new permission
   */
  static async createPermission(permissionData: {
    name: string;
    action: string;
    resource: string;
    description?: string;
    groupId: string;
  }): Promise<Permission | null> {
    try {
      const result = await postData({
        url: "/permissions",
        payload: permissionData,
      });

      return result as Permission;
    } catch (error) {
      console.error("Error creating permission:", error);
      return null;
    }
  }

  /**
   * Updates an existing permission
   */
  static async updatePermission(permissionData: {
    id: string;
    name: string;
    action: string;
    resource: string;
    description?: string;
    groupId: string;
  }): Promise<boolean> {
    try {
      await patchData({
        url: "/permissions",
        payload: permissionData,
      });

      return true;
    } catch (error) {
      console.error("Error updating permission:", error);
      return false;
    }
  }

  /**
   * Deletes a permission by id
   */
  static async deletePermission(id: string): Promise<boolean> {
    try {
      await deleteMethod({
        url: `/permissions`,
        payload: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting permission:", error);
      return false;
    }
  }

  /**
   * Creates a new permission group
   */
  static async createPermissionGroup(groupData: {
    name: string;
    description?: string;
  }): Promise<PermissionGroup | null> {
    try {
      const result = await postData({
        url: "/permissions/groups",
        payload: groupData,
      });

      return result as PermissionGroup;
    } catch (error) {
      console.error("Error creating permission group:", error);
      return null;
    }
  }

  /**
   * Updates an existing permission group
   */
  static async updatePermissionGroup(
    groupId: string,
    groupData: {
      name: string;
      description?: string;
    },
  ): Promise<boolean> {
    try {
      await patchData({
        url: `/permissions/groups/${groupId}`,
        payload: groupData,
      });

      return true;
    } catch (error) {
      console.error("Error updating permission group:", error);
      return false;
    }
  }

  /**
   * Deletes a permission group by id
   */
  static async deletePermissionGroup(id: string): Promise<boolean> {
    try {
      await deleteData(`/permissions/groups/${id}`);

      return true;
    } catch (error) {
      console.error("Error deleting permission group:", error);
      return false;
    }
  }
}
