"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusCircle, UserCog, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteMethod, fetchData, postData, putData } from "~/lib/apiRequest";
import { type Role, type User } from "~/types";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { EmptyUserState } from "./EmptyUserState";
import { UserDialog } from "./UserDialog";
import { UserFilters } from "./UserFilters";
import { UsersList } from "./UsersList";

export function UserManager() {
  const [users, setUsers] = useState<Partial<User>[]>([]);
  const [roles, setRoles] = useState<Partial<Role>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState("");

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | undefined>(
    undefined,
  );
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchUsersAndRoles = async () => {
    try {
      setIsLoading(true);
      setError("");
      const [usersData, rolesData] = await Promise.all([
        fetchData("/xusers"),
        fetchData("/roles"),
      ]);

      if (Array.isArray(usersData)) {
        setUsers(usersData);
      }

      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load users and roles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      !roleFilter || user.roles?.some((role: any) => role.id === roleFilter);

    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsEditMode(false);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setIsEditMode(true);
    setIsUserDialogOpen(true);
  };

  const handleRemoveUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      setError("");

      if (isEditMode && selectedUser?.id) {
        // Update existing user
        await putData({
          url: `/xusers/${selectedUser.id}`,
          payload: userData,
        });

        // Refresh user list
        await fetchUsersAndRoles();
      } else {
        // Create new user
        const newUser = await postData({
          url: "/api/auth/register",
          payload: {
            email: userData.email,
            password: userData.password,
            roles: userData.roles?.map((role: any) => role.id),
          },
        });

        if (newUser) {
          // Refresh user list
          await fetchUsersAndRoles();
        }
      }

      setIsUserDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Failed to save user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.id) return;

    try {
      setIsLoading(true);
      setError("");

      // Delete the user via API
      await deleteMethod({
        url: `/xusers/${selectedUser.id}`,
        payload: { id: selectedUser.id },
      });

      // Refresh user list
      await fetchUsersAndRoles();

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
              <UserCog className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              User Management
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage system users and their roles
            </p>
          </div>
          <Button
            onClick={handleAddUser}
            className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PlusCircle className="h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Users className="mr-2 inline-block h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              System Users ({filteredUsers.length})
            </CardTitle>
            <UserFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              roles={roles}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <UsersList
              users={filteredUsers}
              onEditUser={handleEditUser}
              onRemoveUser={handleRemoveUser}
            />
          ) : (
            <EmptyUserState
              hasFilters={!!(searchTerm || roleFilter)}
              onAddUser={handleAddUser}
            />
          )}
        </CardContent>
      </Card>

      {/* User Dialog */}
      <UserDialog
        isOpen={isUserDialogOpen}
        onClose={() => setIsUserDialogOpen(false)}
        onSave={handleSaveUser}
        roles={roles}
        user={selectedUser}
        isEdit={isEditMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        userEmail={selectedUser?.email || ""}
      />
    </>
  );
}
