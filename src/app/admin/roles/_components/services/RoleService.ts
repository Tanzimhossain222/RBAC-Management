// RoleService.ts
import { deleteMethod, postData, putData } from "~/lib/apiRequest";
import type { Role } from "~/types";

/**
 * Service responsible for Role-related API operations
 */
export class RoleService {
  /**
   * Creates a new role
   */
  static async createRole(
    name: string,
    parentId: string | null,
    description = "",
  ): Promise<Role | null> {
    console.log("Creating role with name:", name);
    console.log("Parent ID:", parentId);
    console.log("Description:", description);

    try {
      const result = await postData({
        url: "/roles",
        payload: {
          name,
          parentId,
          description,
        },
      });

      return result as Role;
    } catch (error) {
      console.error("Error creating role:", error);
      return null;
    }
  }

  /**
   * Updates an existing role
   */
  static async updateRole(
    id: string,
    name: string,
    parentId: string | null,
    description = "",
  ): Promise<boolean> {
    try {
      await putData({
        url: `/roles`,
        payload: {
          id,
          name,
          parentId,
          description,
        },
      });

      return true;
    } catch (error) {
      console.error("Error updating role:", error);
      return false;
    }
  }

  /**
   * Deletes a role by id
   */
  static async deleteRole(id: string): Promise<boolean> {
    try {
      await deleteMethod({
        url: `/roles`,
        payload: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting role:", error);
      return false;
    }
  }
}
