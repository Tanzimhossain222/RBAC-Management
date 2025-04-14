// RoleCardsX.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, UserCog } from "lucide-react";
import type { Permission, Role } from "~/types";

type RolePermissions = Record<
  string,
  {
    direct: Set<string>;
    inherited: Map<
      string,
      { id: string; sourceRoleId: string; sourceRoleName: string }
    >;
  }
>;

const RoleCardsX = ({
  roles,
  permissions,
  rolePermissions,
  setSelectedRoleId,
  setDialogOpen,
}: {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: RolePermissions;
  setSelectedRoleId: (id: string) => void;
  setDialogOpen: (open: boolean) => void;
}) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => {
        const permKeys = rolePermissions[role.id!]?.direct ?? new Set();
        const inheritedPerms =
          rolePermissions[role.id!]?.inherited ?? new Map();

        return (
          <Card
            key={role.id}
            className="rounded-lg border-none bg-gray-700 text-gray-100"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <UserCog className="h-6 w-6 text-indigo-400" />
                <h2 className="text-xl font-semibold capitalize">
                  {role.name}
                </h2>
              </div>
              <div className="space-y-3">
                <p className="font-medium text-gray-300">Permissions:</p>
                {permKeys.size > 0 || inheritedPerms.size > 0 ? (
                  <ul className="space-y-2">
                    {[
                      ...permKeys,
                      ...Array.from(inheritedPerms.keys()).map((id) => {
                        const perm = permissions.find((p) => p.id === id);
                        return perm ? `${perm.action}:${perm.resource}` : "";
                      }),
                    ]
                      .filter(
                        (key, index, self) =>
                          key && self.indexOf(key) === index,
                      )
                      .map((permKey) => {
                        const [action, resource] = permKey.split(":");
                        const permission = permissions.find(
                          (p) => p.action === action && p.resource === resource,
                        );
                        if (!permission) return null;
                        const inheritedEntry = inheritedPerms.get(
                          permission.id,
                        );
                        const isInherited =
                          inheritedEntry !== undefined &&
                          (inheritedEntry as { sourceRoleId: string })
                            .sourceRoleId !== role.id;
                        const sourceRole = (
                          inheritedEntry as
                            | { sourceRoleName: string }
                            | undefined
                        )?.sourceRoleName;

                        return (
                          <li
                            key={permission.id}
                            className={`flex items-center gap-2 text-sm ${
                              isInherited
                                ? "text-gray-400 italic"
                                : "font-medium text-gray-100"
                            }`}
                          >
                            <CheckCircle
                              className={`h-4 w-4 ${
                                isInherited ? "text-gray-400" : "text-green-500"
                              }`}
                            />
                            {permission.name}
                            {isInherited && sourceRole && (
                              <span className="ml-2">
                                (Inherited from {sourceRole})
                              </span>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No permissions assigned.
                  </p>
                )}
              </div>

              <Button
                onClick={() => {
                  setSelectedRoleId(role.id!);
                  setDialogOpen(true);
                }}
                className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Manage Permissions
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoleCardsX;
