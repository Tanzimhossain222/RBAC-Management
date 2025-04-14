"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, UserCog } from "lucide-react"; // Icons

const RoleCards = ({
  roles,
  permissions,
  rolePermissions,
  setSelectedRoleId,
  setDialogOpen,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <Card
          key={role.id}
          className="rounded-lg border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <UserCog className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-semibold text-gray-900 capitalize dark:text-gray-100">
                {role.name}
              </h2>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Assigned Permissions:
              </p>
              {rolePermissions[role.id] && rolePermissions[role.id].size > 0 ? (
                <ul className="space-y-2">
                  {[...rolePermissions[role.id]].map((permissionId) => {
                    const permission = permissions.find(
                      (perm) => perm.id === permissionId,
                    );
                    return permission ? (
                      <li
                        key={permission.id}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {permission.name}
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic dark:text-gray-400">
                  No permissions assigned.
                </p>
              )}
            </div>

            <Button
              onClick={() => {
                setSelectedRoleId(role.id);
                setDialogOpen(true);
              }}
              className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Manage Permissions
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoleCards;
