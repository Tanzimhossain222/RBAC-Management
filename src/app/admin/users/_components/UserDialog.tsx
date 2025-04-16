"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { type Role, type User } from "~/types";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  roles: Partial<Role>[];
  user?: Partial<User>;
  isEdit: boolean;
}

export function UserDialog({
  isOpen,
  onClose,
  onSave,
  roles,
  user,
  isEdit,
}: UserDialogProps) {
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user?.roles?.map((role: any) => role.id) || [],
  );

  const handleSave = () => {
    const userData: Partial<User> = {
      ...(user || {}),
      email,
      ...(password && !isEdit ? { password } : {}),
      roles: selectedRoles.map((roleId) => ({ id: roleId })),
    };
    onSave(userData);
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user information and role assignments."
              : "Add a new user to the system with their initial roles."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="col-span-1">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="user@example.com"
            />
          </div>
          {!isEdit && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="col-span-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                placeholder={isEdit ? "Leave blank to keep current" : ""}
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="col-span-1 pt-1">Roles</Label>
            <div className="col-span-3 space-y-2">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id!)}
                    onCheckedChange={() => handleRoleToggle(role.id!)}
                  />
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="text-sm font-normal"
                  >
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEdit ? "Save Changes" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
