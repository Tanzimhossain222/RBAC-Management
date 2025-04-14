// permissions/_components/PermissionDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type PermissionGroup } from "./types";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode: boolean;
  permissionName: string;
  setPermissionName: (value: string) => void;
  action: string;
  setAction: (value: string) => void;
  resource: string;
  setResource: (value: string) => void;
  selectedGroup: string | null;
  setSelectedGroup: (value: string) => void;
  error: string;
  groups: PermissionGroup[];
  onSubmit: () => void;
  permissionDescription: string;
  setPermissionDescription: (value: string) => void;
}

export function PermissionDialog({
  open,
  onOpenChange,
  editMode,
  permissionName,
  setPermissionName,
  action,
  setAction,
  resource,
  setResource,
  selectedGroup,
  setSelectedGroup,
  error,
  groups,
  onSubmit,
  permissionDescription,
  setPermissionDescription,
}: PermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <DialogTitle className="text-gray-900 dark:text-gray-100">
          {editMode ? "Edit Permission" : "Create Permission"}
        </DialogTitle>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              Permission Name
            </Label>
            <Input
              id="name"
              value={permissionName}
              onChange={(e) => setPermissionName(e.target.value)}
              placeholder="Enter permission name"
              className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="text-gray-700 dark:text-gray-300"
            >
              Permission Description
            </Label>
            <Input
              id="description"
              value={permissionDescription}
              onChange={(e) => setPermissionDescription(e.target.value)}
              placeholder="Enter permission description"
              className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="action"
              className="text-gray-700 dark:text-gray-300"
            >
              Action
            </Label>
            <Input
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="e.g., create, edit, delete"
              className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="resource"
              className="text-gray-700 dark:text-gray-300"
            >
              Resource
            </Label>
            <Input
              id="resource"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              placeholder="e.g., user, content"
              className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="group" className="text-gray-700 dark:text-gray-300">
              Group
            </Label>
            <Select
              onValueChange={setSelectedGroup}
              value={selectedGroup ?? undefined}
            >
              <SelectTrigger
                id="group"
                className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                {groups.map((group) => (
                  <SelectItem
                    key={group.id}
                    value={group.id}
                    className="text-gray-900 hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-indigo-900"
                  >
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <Button
            onClick={onSubmit}
            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {editMode ? "Update Permission" : "Create Permission"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
