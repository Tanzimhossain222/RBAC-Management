// RoleCardsX.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { CheckCircle, Shield, UserCog } from "lucide-react";
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
      {roles.map((role, index) => {
        const permKeys = rolePermissions[role.id!]?.direct ?? new Set();
        const inheritedPerms =
          rolePermissions[role.id!]?.inherited ?? new Map();

        return (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="h-full"
          >
            <Card className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-1">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-white" />
                    <h2 className="text-lg font-bold text-white">
                      {role.name}
                    </h2>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white"
                  >
                    {role.parentId ? "Inherited" : "Root"}
                  </Badge>
                </div>
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-indigo-500" />
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    {role.description || `${role.name} role`}
                  </h3>
                </div>

                <div className="flex-1 space-y-3">
                  <h4 className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Permissions
                  </h4>
                  <ScrollArea className="h-[120px] pr-4">
                    {permKeys.size > 0 || inheritedPerms.size > 0 ? (
                      <ul className="space-y-2">
                        {[
                          ...permKeys,
                          ...Array.from(inheritedPerms.keys()).map((id) => {
                            const perm = permissions.find((p) => p.id === id);
                            return perm
                              ? `${perm.action}:${perm.resource}`
                              : "";
                          }),
                        ]
                          .filter(
                            (key, idx, self) =>
                              key && self.indexOf(key) === idx,
                          )
                          .map((permKey) => {
                            const [action, resource] = permKey.split(":");
                            const permission = permissions.find(
                              (p) =>
                                p.action === action && p.resource === resource,
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
                                className="flex items-center gap-2 text-sm"
                              >
                                <CheckCircle
                                  className={`h-4 w-4 flex-shrink-0 ${
                                    isInherited
                                      ? "text-indigo-300"
                                      : "text-indigo-500"
                                  }`}
                                />
                                <span
                                  className={`truncate ${
                                    isInherited
                                      ? "text-gray-500 dark:text-gray-400"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {permission.name}
                                </span>
                                {isInherited && sourceRole && (
                                  <Badge
                                    variant="outline"
                                    className="ml-auto flex-shrink-0 text-xs"
                                  >
                                    From {sourceRole}
                                  </Badge>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic dark:text-gray-400">
                        No permissions assigned
                      </p>
                    )}
                  </ScrollArea>
                </div>

                <Button
                  onClick={() => {
                    setSelectedRoleId(role.id!);
                    setDialogOpen(true);
                  }}
                  className="mt-5 w-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  Manage Permissions
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoleCardsX;
