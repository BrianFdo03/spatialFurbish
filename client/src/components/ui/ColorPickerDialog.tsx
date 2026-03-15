import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ColorPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (color: string) => void;
}

export function ColorPickerDialog({
  open,
  onClose,
  onSave,
}: ColorPickerDialogProps) {
  const [tempColor, setTempColor] = useState("#000000");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[300px] text-center">
        <DialogHeader>
          <DialogTitle>Select Color</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <input
            type="color"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            className="w-24 h-24 cursor-pointer border-none"
          />
        </div>

        <DialogFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={() => {
              onSave(tempColor);
              onClose();
            }}
            className="bg-[#788F76] text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
