"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertTriangle } from "lucide-react";

export default function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h4 className="font-medium">Delete Account</h4>
          </div>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently removed.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
