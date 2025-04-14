import { db } from "~/server/db";
import type { Role } from "~/types";

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

function collectSiblingsUnderParent(
  parentId: string,
  roleMap: Map<string, Role>,
): string[] {
  const siblings: string[] = [];
  for (const role of roleMap.values()) {
    if (role.parentId === parentId) {
      siblings.push(role.id);
    }
  }
  return siblings;
}

export async function getAllXPermissionsForRoleHierarchy(
  roleId: string,
): Promise<{
  direct: Set<string>;
  inherited: Map<string, string>;
}> {
  const direct = new Set<string>();
  const inherited = new Map<string, string>();

  try {
    const allRoles = await db.role.findMany({
      include: {
        permissions: true,
      },
    });

    const roleMap = new Map<string, Role>();
    for (const role of allRoles) {
      roleMap.set(role.id, role);
    }

    const targetRole = roleMap.get(roleId);
    if (!targetRole) {
      console.log("Role not found:", roleId);
      return { direct, inherited };
    }

    // Direct permissions
    for (const perm of targetRole.permissions ?? []) {
      const permKey = `${perm.action}:${perm.resource}`;
      direct.add(permKey);
      inherited.set(perm.id, roleId); // Mark as direct (same role)
    }

    // Ancestors (Guest has none, User inherits from Guest, etc.)
    const ancestorIds = collectAncestors(roleId, roleMap);
    for (const ancestorId of ancestorIds) {
      const ancestor = roleMap.get(ancestorId);
      for (const perm of ancestor?.permissions ?? []) {
        const permKey = `${perm.action}:${perm.resource}`;
        direct.add(permKey);
        inherited.set(perm.id, ancestorId);
      }
    }

    // Siblings under shared parents (including self and ancestors' parents)
    const sharedParentIds = [roleId, ...ancestorIds]
      .filter((id) => {
        const role = roleMap.get(id);
        return role?.parentId !== null; // Exclude Guest (root)
      })
      .map((id) => roleMap.get(id)!.parentId!);

    for (const parentId of sharedParentIds) {
      const siblings = collectSiblingsUnderParent(parentId, roleMap);
      for (const siblingId of siblings) {
        if (siblingId === roleId) continue; // Skip self
        const siblingRole = roleMap.get(siblingId);
        for (const perm of siblingRole?.permissions ?? []) {
          const permKey = `${perm.action}:${perm.resource}`;
          direct.add(permKey);
          inherited.set(perm.id, siblingId);
        }
      }
    }

    // Validate permissions
    const validPermIds = new Set(
      allRoles.flatMap((r) => r.permissions.map((p) => p.id)),
    );
    for (const permId of [...inherited.keys()]) {
      if (!validPermIds.has(permId)) {
        inherited.delete(permId);
        const perm = allRoles
          .flatMap((r) => r.permissions)
          .find((p) => p.id === permId);
        if (perm) {
          direct.delete(`${perm.action}:${perm.resource}`);
        }
      }
    }

    console.log(`Permissions for ${roleId}:`, { direct, inherited });
  } catch (error) {
    console.error("Error fetching permissions:", error);
  }

  return { direct, inherited };
}
