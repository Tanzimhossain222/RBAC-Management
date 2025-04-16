// RoleHierarchyView.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";
import { type Role } from "~/types";
import RoleTree from "./RoleTree";

interface RoleHierarchyViewProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

/**
 * Component for displaying the role hierarchy in a tree view
 */
export const RoleHierarchyView = ({ roles, onEdit, onDelete }: RoleHierarchyViewProps) => {
  return (
    <Card className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="border-b border-gray-200 pb-3 dark:border-gray-700">
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
          Role Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] py-4">
          {roles.length > 0 ? (
            <RoleTree
              roles={roles}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="mb-3 h-12 w-12 text-gray-400" />
              <p className="text-center text-gray-500 dark:text-gray-400">
                No roles available. Create one to get started!
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};