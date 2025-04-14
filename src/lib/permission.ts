// ~/lib/permission.ts
import { db } from "~/server/db";
import type { Role } from "~/types";

function collectAncestors(
  roleId: string,
  roleMap: Map<string, Role>,
): string[] {
  const ancestors: string[] = [];
  let currentId = roleId;
  while (true) {
    const role = roleMap.get(currentId);
    if (!role?.parentId) break;
    ancestors.push(role.parentId);
    currentId = role.parentId;
  }
  return ancestors;
}

export async function getAllPermissionsForRoleHierarchy(
  roleId: string,
): Promise<Set<string>> {
  const finalPermissions = new Set<string>();
  try {
    // Step 1: Load all roles
    const allRoles = await db.role.findMany({
      include: {
        permissions: true,
      },
    });

    // Step 2: Build lookup map
    const roleMap = new Map<string, Role>();
    for (const role of allRoles) {
      roleMap.set(role.id, {
        id: role.id,
        parentId: role.parentId,
        // @ts-expect-error : Prisma does not include permissions in the type
        permissions: role.permissions.map((p) => ({
          action: p.action,
          resource: p.resource,
        })),
        children: [],
      });
    }

    const targetRole = roleMap.get(roleId);
    if (!targetRole) {
      console.log("Role not found:", roleId);
      return finalPermissions;
    }

    // Step 3: Role permissions
    for (const perm of targetRole.permissions ?? []) {
      const permKey = `${perm.action}:${perm.resource}`;
      finalPermissions.add(permKey);
    }
    console.log("Step 3: Role Permissions", finalPermissions);

    // Step 4: Ancestors
    const ancestorIds = collectAncestors(roleId, roleMap);
    for (const ancestorId of ancestorIds) {
      const ancestor = roleMap.get(ancestorId);
      for (const perm of ancestor?.permissions ?? []) {
        const permKey = `${perm.action}:${perm.resource}`;
        finalPermissions.add(permKey);
      }
    }
    console.log("Step 4: Ancestor Permissions", finalPermissions);

    // Step 5: Validate permissions (exclude invalid like 'f:g', '1:3')
    const validPermKeys = new Set(
      allRoles.flatMap((r) =>
        r.permissions.map((p) => `${p.action}:${p.resource}`),
      ),
    );
    for (const permKey of [...finalPermissions]) {
      if (!validPermKeys.has(permKey)) {
        finalPermissions.delete(permKey);
      }
    }
    console.log("Step 5: Validated Permissions", finalPermissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return finalPermissions;
  }
  return finalPermissions;
}
