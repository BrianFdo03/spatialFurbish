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

        <div className="flex flex-col items-center gap-6 py-6 border-b border-stone-100 mb-2">
          <input
            type="color"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            className="w-24 h-24 cursor-pointer border-none rounded shadow-sm"
          />
          <div className="w-full flex items-center justify-center gap-2 px-6">
            <span className="text-sm font-medium text-stone-500">HEX:</span>
            <input
              type="text"
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
              placeholder="#000000"
              className="w-28 text-center uppercase tracking-widest text-stone-700 bg-stone-50 border border-stone-200 rounded-md py-2 focus:ring-1 focus:ring-[#788F76] focus:outline-none"
            />
          </div>
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
