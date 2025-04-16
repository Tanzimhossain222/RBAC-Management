// RoleDetailsView.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Role } from "~/types";
import RoleCard from "./RoleCard";

interface RoleDetailsViewProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

/**
 * Component for displaying role details in a card grid
 */
export const RoleDetailsView = ({ roles, onEdit, onDelete }: RoleDetailsViewProps) => {
  return (
    <Card className="rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="border-b border-gray-200 pb-3 dark:border-gray-700">
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
          Role Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard 
              key={role.id} 
              role={role} 
              roles={roles}
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};