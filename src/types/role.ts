import type { Permission } from "./permission";

export type Role = {
  id?: string;
  parentId: string | null;
  permissions?: Permission[];
  children?: Role[];
  name: string;
  description?: string;
};

export function isRole(obj: unknown): obj is Role {
  if (typeof obj !== "object" || obj === null) return false;

  const role = obj as Role;

  // Check parentId
  const isParentValid =
    typeof role.parentId === "string" || role.parentId === null;

  // Check permissions array
  const isPermissionsValid =
    Array.isArray(role.permissions) &&
    role.permissions.every(
      (p) =>
        typeof p === "object" &&
        p !== null &&
        typeof p.action === "string" &&
        typeof p.resource === "string" &&
        (typeof p.id === "undefined" || typeof p.id === "string"),
    );

  // Check optional id
  const isIdValid =
    typeof role.id === "undefined" || typeof role.id === "string";

  // Check optional children
  const isChildrenValid =
    typeof role.children === "undefined" ||
    (Array.isArray(role.children) && role.children.every(isRole)); // recursive validation

  return isParentValid && isPermissionsValid && isIdValid && isChildrenValid;
}

export function isRolesArray(roles: unknown): roles is Role[] {
  return Array.isArray(roles) && roles.every(isRole);
}
