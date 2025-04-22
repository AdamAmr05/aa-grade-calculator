import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  calculateOverallPointsNeededForGrade,
  calculateRequiredFinalScoreForTarget,
} from "@/utils/letterGrades";
import { ChevronRight } from "lucide-react";

interface LetterGradeGoalsProps {
  currentGrade: number;
  currentGradeWithoutFinal: number;
  finalWeight: number;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const LetterGradeGoals: React.FC<LetterGradeGoalsProps> = ({
  currentGrade,
  currentGradeWithoutFinal,
  finalWeight,
  enabled,
  onToggle,
}) => {
  const goalsData = calculateOverallPointsNeededForGrade(currentGrade);

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
          {goalsData.length > 0 ? (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {goalsData.map(({ grade, pointsNeeded, targetScore }) => {
                  let baseText = `Need ${pointsNeeded.toFixed(1)}% more`;
                  let finalText = "";

                  if (finalWeight > 0) {
                    const requiredFinalScore = calculateRequiredFinalScoreForTarget(
                      currentGradeWithoutFinal,
                      finalWeight,
                      targetScore
                    );

                    if (requiredFinalScore !== null) {
                      finalText = ` (requires ${requiredFinalScore.toFixed(1)}% on final)`;
                    } else {
                      finalText = ` (impossible with final)`;
                    }
                  }

                  return (
                    <div
                      key={grade}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/50 backdrop-blur border"
                    >
                      <div className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{grade} ({targetScore}%)</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {baseText}{finalText}
                      </span>
                    </div>
                  );
                })}
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
