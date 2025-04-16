// RoleNode.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Info, Trash2 } from "lucide-react";
import type { Role } from "~/types";

interface RoleNodeProps {
  role: Role;
  depth: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  children?: React.ReactNode;
}

export default function RoleNode({
  role,
  depth,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  children,
}: RoleNodeProps) {
  const lineColors = [
    "border-blue-500",
    "border-green-500",
    "border-yellow-500",
    "border-purple-500",
    "border-pink-500",
    "border-red-500",
    "border-teal-500",
    "border-orange-500",
    "border-gray-500",
  ];
  const lineColor = lineColors[depth % lineColors.length];

  return (
    <div className={`ml-6 ${lineColor} border-l-2 py-1 pl-4`}>
      <div className="group flex items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(role.id!)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {role.name}
          </span>
          {role.description && (
            <span
              className="ml-2 hidden cursor-help items-center text-xs text-gray-500 group-hover:inline-flex hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title={role.description}
            >
              <Info className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-full p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
            onClick={() => onEdit(role)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-full p-0 text-red-600 hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
            onClick={() => onDelete(role.id!)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
      {isExpanded && children}
    </div>
  );
}
