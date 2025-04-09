"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Trash2 } from "lucide-react";

export interface Role {
  id: string;
  name: string;
  parentId: string | null;
  userCount: number;
}

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
      <div className="group flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(role.id)}
            className="text-gray-500 dark:text-gray-400"
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
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({role.userCount} users)
          </span>
        </div>
        <div className="flex gap-2 opacity-40 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => onEdit(role)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            onClick={() => onDelete(role.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isExpanded && children}
    </div>
  );
}
