"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { type User } from "~/types";

interface UsersListProps {
  users: Partial<User>[];
  onEditUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

export function UsersList({ users, onEditUser, onRemoveUser }: UsersListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
            >
              User
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
            >
              Roles
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {user.email?.[0].toUpperCase() || "U"}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {user.id}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role: any) => (
                      <Badge
                        key={role.id}
                        variant="outline"
                        className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      No roles assigned
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-indigo-200 px-3 text-xs hover:bg-indigo-50 dark:border-indigo-900 dark:hover:bg-indigo-900/30"
                    onClick={() => onEditUser(user.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-red-200 px-3 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                    onClick={() => onRemoveUser(user.id)}
                  >
                    Remove
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
