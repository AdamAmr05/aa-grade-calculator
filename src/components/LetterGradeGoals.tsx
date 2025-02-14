
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculatePointsNeeded } from "@/utils/letterGrades";
import { ChevronRight } from "lucide-react";

interface LetterGradeGoalsProps {
  currentGrade: number;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const LetterGradeGoals: React.FC<LetterGradeGoalsProps> = ({
  currentGrade,
  enabled,
  onToggle,
}) => {
  const pointsNeeded = calculatePointsNeeded(currentGrade);

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur bg-white/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Letter Grade Goals</CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            id="letter-grades"
            checked={enabled}
            onCheckedChange={onToggle}
          />
          <Label htmlFor="letter-grades">Show Goals</Label>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent>
          {pointsNeeded.length > 0 ? (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {pointsNeeded.map(({ grade, pointsNeeded }) => (
                  <div
                    key={grade}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/50 backdrop-blur border"
                  >
                    <div className="flex items-center space-x-2">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{grade}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Need {pointsNeeded}% more
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-4 text-green-600">
              Congratulations! You've reached or exceeded all letter grade goals!
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
