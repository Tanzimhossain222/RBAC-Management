// permissions/_components/GroupDialog.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  setGroupName: (value: string) => void;
  groupDescription?: string;
  setGroupDescription?: (value: string) => void;
  error: string;
  onSubmit: () => void;
  editMode?: boolean;
}

export const GroupDialog = memo<GroupDialogProps>(
  ({
    open,
    onOpenChange,
    groupName,
    setGroupName,
    groupDescription = "",
    setGroupDescription,
    error,
    onSubmit,
    editMode = false,
  }: GroupDialogProps) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* {!editMode && (
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-none bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
        )} */}
        <DialogContent className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {editMode ? "Edit Permission Group" : "Create Permission Group"}
          </DialogTitle>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="groupName"
                className="text-gray-700 dark:text-gray-300"
              >
                Group Name
              </Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="groupDescription"
                className="text-gray-700 dark:text-gray-300"
              >
                Group Description
              </Label>
              <Input
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription?.(e.target.value)}
                placeholder="Enter group description (optional)"
                className="border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              onClick={onSubmit}
              className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {editMode ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

GroupDialog.displayName = "GroupDialog";
