"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";

interface EmptyUserStateProps {
  hasFilters: boolean;
  onAddUser: () => void;
}

export function EmptyUserState({ hasFilters, onAddUser }: EmptyUserStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center space-y-3 p-6 text-center">
      <Users className="h-12 w-12 text-gray-400" />
      <div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          No users found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {hasFilters
            ? "Try adjusting your search or filter criteria"
            : "Start by adding some users to your system"}
        </p>
      </div>
      <Button
        onClick={onAddUser}
        className="mt-2 gap-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        <PlusCircle className="h-4 w-4" />
        Add {hasFilters ? "New" : "First"} User
      </Button>
    </div>
  );
}
