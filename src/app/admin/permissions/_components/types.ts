// permissions/_components/types.ts
export interface Permission {
  id: string;
  name?: string;
  action: string;
  resource: string;
  groupId: string;
  description?: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
}
