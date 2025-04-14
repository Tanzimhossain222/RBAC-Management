import { db } from "~/server/db";

// types.ts
export type Permission = {
  action: string;
  resource: string;
};

export type Role = {
  id: string;
  parentId: string | null;
  permissions: Permission[];
  children: Role[];
};

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

function collectDescendants(
  roleId: string,
  childMap: Map<string, string[]>,
): string[] {
  const result: string[] = [];
  const queue: string[] = [roleId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = childMap.get(current) ?? [];
    result.push(...children);
    queue.push(...children);
  }
  return result;
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
        children: true,
      },
    });

    // Step 2: Build lookup maps
    const roleMap = new Map<string, Role>();
    const childMap = new Map<string, string[]>();
    for (const role of allRoles) {
      roleMap.set(role.id, {
        id: role.id,
        parentId: role.parentId,
        permissions: role.permissions.map((p) => ({
          action: p.action,
          resource: p.resource,
        })),
        children: [],
      });
      if (role.parentId) {
        const existing = childMap.get(role.parentId) ?? [];
        existing.push(role.id);
        childMap.set(role.parentId, existing);
      }
    }

    const targetRole = roleMap.get(roleId);
    if (!targetRole) {
      console.log("Role not found:", roleId);
      return finalPermissions;
    }

    // Step 3: Role permissions
    for (const perm of targetRole.permissions || []) {
      finalPermissions.add(`${perm.action}:${perm.resource}`);
    }
    console.log("Step 3: Role Permissions", finalPermissions);

    // Step 4: Ancestors
    const ancestorIds = collectAncestors(roleId, roleMap);
    for (const ancestorId of ancestorIds) {
      const ancestor = roleMap.get(ancestorId);
      for (const perm of ancestor?.permissions ?? []) {
        finalPermissions.add(`${perm.action}:${perm.resource}`);
      }
    }
    console.log("Step 4: Ancestor Permissions", finalPermissions);

    // Step 5: Descendants
    const descendantIds = collectDescendants(roleId, childMap);
    for (const descId of descendantIds) {
      const descRole = roleMap.get(descId);
      for (const perm of descRole?.permissions ?? []) {
        finalPermissions.add(`${perm.action}:${perm.resource}`);
      }
    }
    console.log("Step 5: Descendant Permissions", finalPermissions);

    // Step 6: Siblings under shared ancestors
    const sharedAncestorIds = [roleId, ...ancestorIds];
    for (const ancestorId of sharedAncestorIds) {
      const siblingDescendants = collectDescendants(ancestorId, childMap);
      for (const siblingId of siblingDescendants) {
        if (siblingId === roleId) continue;
        const siblingRole = roleMap.get(siblingId);
        for (const perm of siblingRole?.permissions ?? []) {
          finalPermissions.add(`${perm.action}:${perm.resource}`);
        }
      }
    }
    console.log("Step 6: Final Permissions", finalPermissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return finalPermissions;
  }
  return finalPermissions;
}
