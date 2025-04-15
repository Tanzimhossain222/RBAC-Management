// PermissionList.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { type Permission, type PermissionGroup } from "./types";
import PermissionItem from "./PermissionItem";

interface PermissionListProps {
  permissions: Permission[];
  permissionGroups: PermissionGroup[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
  onAddPermission: () => void;
  onEditPermission: (permission: Permission) => void;
  onDeletePermission: (id: string) => void;
}

/**
 * Component for displaying the list of permissions with search and filtering
 */
export const PermissionList = ({
  permissions,
  permissionGroups,
  searchQuery,
  onSearchChange,
  isLoading,
  onAddPermission,
  onEditPermission,
  onDeletePermission
}: PermissionListProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Search className="text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search permissions..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9"
            />
          </div>
          <Button onClick={onAddPermission}>
            <Plus className="mr-2 h-4 w-4" />
            Add Permission
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))
            ) : permissions.length === 0 ? (
              <div className="text-muted-foreground flex h-32 items-center justify-center">
                No permissions found
              </div>
            ) : (
              permissions.map((permission) => (
                <PermissionItem
                  key={permission.id}
                  permission={permission}
                  group={permissionGroups.find(g => g.id === permission.groupId)}
                  onEdit={onEditPermission}
                  onDelete={onDeletePermission}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};