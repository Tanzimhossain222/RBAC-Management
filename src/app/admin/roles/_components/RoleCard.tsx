// RoleCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Role } from "~/types";

interface RoleCardProps {
  role: Role;
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

/**
 * Component for displaying a single role card
 */
const RoleCard = ({ role, roles, onEdit, onDelete }: RoleCardProps) => {
  // Find parent role name
  const parentRole = role.parentId 
    ? roles.find((r) => r.id === role.parentId) 
    : null;

  return (
    <Card
      key={role.id}
      className="overflow-hidden border-gray-200 transition-all hover:shadow-md dark:border-gray-700"
    >
      <CardHeader className="bg-gray-50 p-4 dark:bg-gray-900">
        <CardTitle className="text-lg">{role.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Parent:
            </span>
            <span className="font-medium">
              {parentRole ? parentRole.name : "None"}
            </span>
          </div>
          {role.description && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Description:
              </span>
              <span className="font-medium max-w-[70%] text-right">
                {role.description}
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(role)}
            className="flex-1 rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(role.id!)}
            className="flex-1 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;