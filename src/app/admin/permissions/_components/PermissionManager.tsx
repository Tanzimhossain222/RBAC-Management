"use client";

import { Shield } from "lucide-react";
import { GroupDialog } from "./GroupDialog";
import { GroupSidebar } from "./GroupSidebar";
import { usePermissionGroups } from "./hooks/usePermissionGroups";
import { usePermissions } from "./hooks/usePermissions";
import { PermissionDialog } from "./PermissionDialog";
import { PermissionList } from "./PermissionList";
import { type Permission, type PermissionGroup } from "./types";

type PermissionManagerProps = {
  permissionGroupsData: PermissionGroup[];
  permissionsData: Permission[];
};

/**
 * Main component for managing permissions and permission groups
 */
export default function PermissionManager({
  permissionGroupsData,
  permissionsData,
}: PermissionManagerProps) {
  // Use custom hooks to manage state and operations
  const {
    permissionGroups,
    isLoading: isGroupLoading,
    dialogGroupOpen,
    setDialogGroupOpen,
    groupName,
    setGroupName,
    groupDescription,
    setGroupDescription,
    editGroupMode,
    error: groupError,
    openAddGroupDialog,
    openEditGroupDialog,
    createOrUpdateGroup,
    deleteGroup,
  } = usePermissionGroups(permissionGroupsData);

  const {
    searchQuery,
    setSearchQuery,
    selectedGroupFilter,
    setSelectedGroupFilter,
    isLoading: isPermissionLoading,
    dialogOpen,
    setDialogOpen,
    editMode,
    permissionName,
    permissionDescription,
    action,
    resource,
    selectedGroup,
    error: permissionError,
    openCreateDialog,
    openEditDialog,
    createOrUpdatePermission,
    deletePermission,
    setPermissionName,
    setPermissionDescription,
    setAction,
    setResource,
    setSelectedGroup,
    getFilteredPermissions,
  } = usePermissions(permissionsData, permissionGroups);

  // Get filtered permissions based on search and group filter
  const filteredPermissions = getFilteredPermissions();

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-primary h-6 w-6" />
          <h1 className="text-2xl font-bold">Permission Management</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Groups Sidebar */}
        <GroupSidebar
          permissionGroups={permissionGroups}
          selectedGroupFilter={selectedGroupFilter}
          onGroupSelect={setSelectedGroupFilter}
          onAddGroup={openAddGroupDialog}
          onEditGroup={openEditGroupDialog}
          onDeleteGroup={deleteGroup}
        />

        {/* Permissions List */}
        <PermissionList
          permissions={filteredPermissions}
          permissionGroups={permissionGroups}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isPermissionLoading}
          onAddPermission={openCreateDialog}
          onEditPermission={openEditDialog}
          onDeletePermission={deletePermission}
        />
      </div>

      {/* Permission Dialog */}
      <PermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={createOrUpdatePermission}
        groups={permissionGroups}
        editMode={editMode}
        permissionName={permissionName}
        setPermissionName={setPermissionName}
        permissionDescription={permissionDescription}
        setPermissionDescription={setPermissionDescription}
        action={action}
        setAction={setAction}
        resource={resource}
        setResource={setResource}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        error={permissionError}
      />

      {/* Group Dialog */}
      <GroupDialog
        open={dialogGroupOpen}
        onOpenChange={setDialogGroupOpen}
        onSubmit={createOrUpdateGroup}
        editMode={editGroupMode}
        groupName={groupName}
        setGroupName={setGroupName}
        groupDescription={groupDescription}
        setGroupDescription={setGroupDescription}
        error={groupError}
      />
    </div>
  );
}
