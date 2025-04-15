// GroupSidebar.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { type PermissionGroup } from "./types";

interface GroupSidebarProps {
  permissionGroups: PermissionGroup[];
  selectedGroupFilter: string | null;
  onGroupSelect: (groupId: string | null) => void;
  onAddGroup: () => void;
  onEditGroup: (group: PermissionGroup) => void;
  onDeleteGroup: (id: string) => void;
}

/**
 * Component for displaying and managing permission groups in a sidebar
 */
export const GroupSidebar = ({
  permissionGroups,
  selectedGroupFilter,
  onGroupSelect,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
}: GroupSidebarProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Permission Groups</h2>
          <Button 
            size="sm" 
            onClick={onAddGroup}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2">
            <Button
              variant={!selectedGroupFilter ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onGroupSelect(null)}
            >
              All Permissions
            </Button>
            {permissionGroups.map((group) => (
              <div key={group.id} className="flex items-center gap-2">
                <Button
                  variant={
                    selectedGroupFilter === group.id ? "secondary" : "ghost"
                  }
                  className="flex-grow justify-start"
                  onClick={() => onGroupSelect(group.id)}
                >
                  {group.name}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEditGroup(group)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDeleteGroup(group.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};