// permissions/_components/GroupDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  setGroupName: (value: string) => void;
  error: string;
  onSubmit: () => void;
  editMode?: boolean; // Add editMode prop
}

export function GroupDialog({
  open,
  onOpenChange,
  groupName,
  setGroupName,
  error,
  onSubmit,
  editMode = false, // Default to false for create mode
}: GroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!editMode && ( // Only show trigger for create mode
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-none bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <DialogTitle className="text-gray-900 dark:text-gray-100">
          {editMode ? "Edit Permission Group" : "Create Permission Group"}
        </DialogTitle>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="groupName" className="text-gray-700 dark:text-gray-300">
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
}