import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LetterGrade } from "@/utils/letterGrades";
import { useToast } from "@/components/ui/use-toast";
import { Settings } from "lucide-react";

interface GradeScaleEditorProps {
  currentScale: LetterGrade[];
  onSave: (newScale: LetterGrade[]) => void;
  triggerButton?: React.ReactNode; // Optional custom trigger
}

export const GradeScaleEditor: React.FC<GradeScaleEditorProps> = ({
  currentScale,
  onSave,
  triggerButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editableScale, setEditableScale] = useState<LetterGrade[]>([]);
  const { toast } = useToast();

  // Initialize editable scale when the dialog opens or currentScale changes
  useEffect(() => {
    if (isOpen) {
      // Create a deep copy to avoid modifying the original state directly
      setEditableScale(JSON.parse(JSON.stringify(currentScale)));
    }
  }, [isOpen, currentScale]);

  const handleInputChange = (grade: string, value: string) => {
    const newScore = parseInt(value, 10);
    // Basic validation: ensure it's a number
    if (isNaN(newScore)) return;

    setEditableScale((prevScale) =>
      prevScale.map((item) =>
        item.grade === grade ? { ...item, minScore: newScore } : item
      )
    );
  };

  const validateScale = (scale: LetterGrade[]): string | null => {
      // Check for non-numeric or out-of-range values
      for (const item of scale) {
          if (isNaN(item.minScore) || item.minScore < 0 || item.minScore > 100) {
              return `Invalid score for ${item.grade}. Must be between 0 and 100.`;
          }
      }

      // Check if higher grades have lower or equal scores than lower grades
      const sortedScale = [...scale].sort((a, b) => b.minScore - a.minScore); // Sort descending
      for (let i = 0; i < sortedScale.length - 1; i++) {
          if (sortedScale[i].minScore <= sortedScale[i + 1].minScore) {
               // Allow equal scores for simplicity, but higher grade must be >= lower grade
               if (sortedScale[i].grade !== sortedScale[i + 1].grade && sortedScale[i].minScore < sortedScale[i + 1].minScore) {
                  return `Score for ${sortedScale[i].grade} (${sortedScale[i].minScore}%) must be greater than or equal to score for ${sortedScale[i+1].grade} (${sortedScale[i+1].minScore}%).`;
               }
               // Check for duplicate minimum scores (optional, might be valid in some systems)
               // if (sortedScale[i].minScore === sortedScale[i+1].minScore) {
               //    return `Minimum scores for ${sortedScale[i].grade} and ${sortedScale[i+1].grade} cannot be the same.`;
               // }
          }
      }
      return null; // No errors found
  };


  const handleSave = () => {
      const validationError = validateScale(editableScale);
      if (validationError) {
          toast({
              title: "Invalid Scale",
              description: validationError,
              variant: "destructive",
          });
          return;
      }

      // Sort before saving to ensure consistent order if needed elsewhere
      const sortedScaleToSave = [...editableScale].sort((a, b) => b.minScore - a.minScore);
      onSave(sortedScaleToSave);
      setIsOpen(false); // Close dialog on save
      toast({
         title: "Grading Scale Saved",
         description: "Your custom grading scale has been updated.",
      });
  };

  // Default trigger button if none provided
  const defaultTrigger = (
      <Button variant="outline" size="sm">
        <Settings className="mr-2 h-4 w-4" />
        Edit Grade Scale
      </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Grading Scale</DialogTitle>
          <DialogDescription>
            Set the minimum overall percentage required for each letter grade.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {/* Sort for consistent display order */}
          {editableScale.sort((a, b) => b.minScore - a.minScore).map(({ grade, minScore }) => (
            <div key={grade} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`score-${grade}`} className="text-right">
                {grade}
              </Label>
              <Input
                id={`score-${grade}`}
                type="number"
                value={minScore}
                onChange={(e) => handleInputChange(grade, e.target.value)}
                className="col-span-3"
                min="0"
                max="100"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 