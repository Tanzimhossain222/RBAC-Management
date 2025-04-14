"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteData,
  deleteMethod,
  patchData,
  postData,
} from "~/lib/apiRequest";
import { GroupDialog } from "./GroupDialog";
import { PermissionDialog } from "./PermissionDialog";
import { PermissionGroup } from "./PermissionGroup";
import {
  type Permission,
  type PermissionGroup as PermissionGroupType,
} from "./types";

const fetchPermissionGroups = async (): Promise<PermissionGroupType[]> => [
  { id: "1", name: "User Management" },
  { id: "2", name: "Content Management" },
];

const fetchPermissions = async (): Promise<Permission[]> => [
  {
    id: "1",
    name: "Create User",
    action: "create",
    resource: "user",
    groupId: "1",
  },
  {
    id: "2",
    name: "Edit User",
    action: "edit",
    resource: "user",
    groupId: "2",
  },
];

type PermissionManagerProps = {
  permissionGroupsData: PermissionGroupType[];
  permissionsData: Permission[];
};

export default function PermissionManager({
  permissionGroupsData,
  permissionsData,
}: PermissionManagerProps) {
  const [permissionGroups, setPermissionGroups] = useState<
    PermissionGroupType[]
  >([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPermissionId, setCurrentPermissionId] = useState<string | null>(
    null,
  );
  const [permissionName, setPermissionName] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dialogGroupOpen, setDialogGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");

  const [editGroupMode, setEditGroupMode] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (permissionGroupsData) {
      setPermissionGroups(permissionGroupsData);
    }

    if (permissionsData) {
      setPermissions(permissionsData);
    }
  }, [permissionGroupsData, permissionsData]);

  const resetForm = () => {
    setEditMode(false);
    setCurrentPermissionId(null);
    setPermissionName("");
    setAction("");
    setResource("");
    setSelectedGroup(null);
    setError("");
    setPermissionDescription("");
  };

  const resetGroupForm = () => {
    setGroupName("");
    setError("");
    setEditGroupMode(false);
    setCurrentGroupId(null);
  };

  const validateForm = () => {
    if (
      !permissionName.trim() ||
      !action.trim() ||
      !resource.trim() ||
      !selectedGroup
    ) {
      setError("All fields, including group, are required.");
      return false;
    }

    return true;
  };

  const validateGroupForm = () => {
    if (!groupName.trim()) {
      setError("Group name cannot be empty");
      return false;
    }
    if (
      permissionGroups.some(
        (group) => group.name.toLowerCase() === groupName.toLowerCase(),
      )
    ) {
      setError("Group name must be unique");
      return false;
    }
    return true;
  };

  const handleCreateOrUpdatePermission = async () => {
    if (!validateForm()) return;

    if (editMode) {
      const res = await patchData({
        url: "/permissions",
        payload: {
          id: currentPermissionId,
          action,
          resource,
          name: permissionName,
          description: permissionDescription,
          groupId: selectedGroup,
        },
      });
      if (!res) return;
      const updatedPermissions = permissions.map((perm) =>
        perm.id === currentPermissionId
          ? {
              ...perm,
              name: permissionName,
              action,
              resource,
              description: permissionDescription,
              groupId: selectedGroup!,
            }
          : perm,
      );
      setPermissions(updatedPermissions);
    } else {
      const res = await postData({
        url: "/permissions",
        payload: {
          action,
          resource,
          description: permissionDescription,
          name: permissionName,
          groupId: selectedGroup,
        },
      });

      if (!res) return;

      setPermissions((pre) => {
        return [...pre, res as Permission];
      });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleCreateGroup = async () => {
    if (!validateGroupForm()) return;

    if (editGroupMode) {
      const res = await patchData({
        url: `/permissions/groups/${currentGroupId}`,
        payload: { name: groupName },
      });
      if (!res) return;
      const updatedGroups = permissionGroups.map((group) =>
        group.id === currentGroupId ? { ...group, name: groupName } : group,
      );
      setPermissionGroups(updatedGroups);
    } else {
      const res = await postData({
        url: "/permissions/groups",
        payload: { name: groupName },
      });

      setPermissionGroups((pre) => {
        return [...pre, res as PermissionGroupType];
      });
    }
    setDialogGroupOpen(false);
    resetGroupForm();
  };

  const handleEditPermission = (permission: Permission) => {
    setEditMode(true);
    setCurrentPermissionId(permission.id);
    setPermissionName(permission.description ?? "");
    setAction(permission.action);
    setResource(permission.resource);
    setSelectedGroup(permission.groupId);
    setDialogOpen(true);
  };

  const handleDeletePermission = async (id: string) => {
    const res = await deleteMethod({
      url: `/permissions`,
      payload: { id },
    });
    if (!res) return;

    const updatedPermissions = permissions.filter((perm) => perm.id !== id);
    setPermissions(updatedPermissions);
  };

  const handleDeleteGroup = async (id: string) => {
    const res = await deleteData(`/permissions/groups/${id}`);
    if (!res) return;

    const updatedGroups = permissionGroups.filter((group) => group.id !== id);
    const updatedPermissions = permissions.filter(
      (perm) => perm.groupId !== id,
    );
    setPermissionGroups(updatedGroups);
    setPermissions(updatedPermissions);
  };

  const handleEditGroup = (group: PermissionGroupType) => {
    setEditGroupMode(true);
    setCurrentGroupId(group.id);
    setGroupName(group.name);
    setDialogGroupOpen(true);
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Permission Management
        </h1>
        <GroupDialog
          open={dialogGroupOpen}
          onOpenChange={(open) => {
            setDialogGroupOpen(open);
            if (!open) resetGroupForm();
          }}
          groupName={groupName}
          setGroupName={setGroupName}
          error={error}
          onSubmit={handleCreateGroup}
          editMode={editGroupMode}
        />
      </div>

      <Card className="w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-6">
          <ScrollArea className="max-h-[calc(100vh-200px)] w-full overflow-auto pr-4">
            {permissionGroups.length > 0 ? (
              permissionGroups.map((group) => (
                <PermissionGroup
                  key={group.id}
                  group={group}
                  permissions={permissions}
                  onEditGroup={handleEditGroup}
                  onDeleteGroup={handleDeleteGroup}
                  onAddPermission={() => setDialogOpen(true)}
                  onEditPermission={handleEditPermission}
                  onDeletePermission={handleDeletePermission}
                />
              ))
            ) : (
              <p className="py-10 text-center text-gray-500 dark:text-gray-400">
                No permission groups available. Create one to get started!
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <PermissionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
        editMode={editMode}
        permissionName={permissionName}
        setPermissionName={setPermissionName}
        action={action}
        setAction={setAction}
        resource={resource}
        setResource={setResource}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        error={error}
        groups={permissionGroups}
        onSubmit={handleCreateOrUpdatePermission}
        permissionDescription={permissionDescription}
        setPermissionDescription={setPermissionDescription}
      />
    </div>
  );
}
