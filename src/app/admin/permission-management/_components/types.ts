// types.ts
export type Role = {
  id: string;
  name: string;
  parentId: string | null;
  permissions: Permission[];
};

export type PermissionGroup = {
  id: string;
  name: string;
};

export type Permission = {
  id: string;
  name: string;
  action: string;
  resource: string;
  groupId: string;
};

export type RolePermissions = Record<string, Set<string>>;