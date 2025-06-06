export interface Permission {
  id: string;
  name?: string;
  action: string;
  resource: string;
  groupId: string;
  description?: string;
}

export type PermissionGroup = {
  id: string;
  name: string;
  description?: string;
};

export function isPermissionGroup(obj: unknown): obj is PermissionGroup {
  if (typeof obj !== "object" || obj === null) return false;

  const permissionGroup = obj as PermissionGroup;

  // Check id
  const isIdValid =
    typeof permissionGroup.id === "string" || permissionGroup.id === undefined;

  // Check name
  const isNameValid = typeof permissionGroup.name === "string";

  return isIdValid && isNameValid;
}
export function isPermissionGroupArray(obj: unknown): obj is PermissionGroup[] {
  if (!Array.isArray(obj)) return false;

  return obj.every(isPermissionGroup);
}

export function isPermission(obj: unknown): obj is Permission {
  if (typeof obj !== "object" || obj === null) return false;

  const permission = obj as Permission;

  // Check id
  const isIdValid =
    typeof permission.id === "string" || permission.id === undefined;

  // Check name
  const isNameValid =
    typeof permission.name === "string" || permission.name === undefined;

  // Check action
  const isActionValid = typeof permission.action === "string";

  // Check resource
  const isResourceValid = typeof permission.resource === "string";

  // Check groupId
  const isGroupIdValid =
    typeof permission.groupId === "string" || permission.groupId === undefined;

  return (
    isIdValid &&
    isNameValid &&
    isActionValid &&
    isResourceValid &&
    isGroupIdValid
  );
}

export function isPermissionArray(obj: unknown): obj is Permission[] {
  if (!Array.isArray(obj)) return false;

  return obj.every(isPermission);
}
