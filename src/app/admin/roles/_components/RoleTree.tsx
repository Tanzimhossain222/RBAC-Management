// RoleTree.tsx
"use client";

import { useEffect, useState } from "react";
import type { Role } from "~/types";
import RoleNode from "./RoleNode";

interface RoleTreeProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export default function RoleTree({ roles, onEdit, onDelete }: RoleTreeProps) {
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  // Expand all roles by default
  useEffect(() => {
    const allRoleIds = new Set(
      roles.filter((role) => role.id).map((role) => role.id!),
    );
    setExpandedRoles(allRoleIds);
  }, [roles]);

  const toggleRoleExpansion = (roleId: string) => {
    const newSet = new Set(expandedRoles);
    if (newSet.has(roleId)) newSet.delete(roleId);
    else newSet.add(roleId);
    setExpandedRoles(newSet);
  };

  const renderTree = (parentId: string | null = null, depth = 0) => {
    return roles
      .filter((role) => role.parentId === parentId)
      .map((role) => (
        <RoleNode
          key={role.id}
          role={role}
          depth={depth}
          isExpanded={expandedRoles.has(role.id!)}
          onToggle={toggleRoleExpansion}
          onEdit={onEdit}
          onDelete={onDelete}
        >
          {expandedRoles.has(role.id!) && renderTree(role.id, depth + 1)}
        </RoleNode>
      ));
  };

  return <div>{renderTree()}</div>;
}
