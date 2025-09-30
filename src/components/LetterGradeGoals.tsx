import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ChevronRight } from "lucide-react";
import {
  calculateOverallPointsNeededForGrade,
  calculateRequiredFinalScoreForTarget,
  LetterGrade,
} from "@/utils/letterGrades";

interface LetterGradeGoalsProps {
  currentGrade: number;
  currentGradeWithoutFinal: number;
  finalWeight: number;
  gradingScale: LetterGrade[];
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const LetterGradeGoals: React.FC<LetterGradeGoalsProps> = ({
  currentGrade,
  currentGradeWithoutFinal,
  finalWeight,
  gradingScale,
  enabled,
  onToggle,
}) => {
  const goalsData = calculateOverallPointsNeededForGrade(currentGrade, gradingScale);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur bg-white/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
        <CardTitle className="text-xl font-semibold">Letter Grade Goals</CardTitle>
        <div className="flex items-center gap-3">
          <Label htmlFor="letter-grades" className="cursor-pointer text-sm">Show Goals</Label>
          <Switch
            id="letter-grades"
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>
      </CardHeader>
      {enabled && (
        <CardContent>
          {goalsData.length > 0 ? (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {goalsData.map(({ grade, pointsNeeded, targetScore }) => {
                  let baseText = `Need ${pointsNeeded.toFixed(1)}% more overall`;
                  let finalExamInfo = null;

                  if (finalWeight > 0) {
                    if (targetScore <= currentGradeWithoutFinal) {
                      finalExamInfo = <span className="text-green-600">Already achieved!</span>;
                    } else {
                      const requiredFinalScore = calculateRequiredFinalScoreForTarget(
                        currentGradeWithoutFinal,
                        finalWeight,
                        targetScore
                      );

                      if (requiredFinalScore !== null) {
                        finalExamInfo = (
                          <span>Requires <strong className="font-semibold">{requiredFinalScore.toFixed(1)}%</strong> on final exam</span>
                        );
                      } else {
                        finalExamInfo = <span className="text-red-600">Impossible with final exam</span>;
                      }
                    }
                  }

                  const isExpanded = expandedGrade === grade;

                  return (
                    <div key={grade}>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 backdrop-blur border">
                        <div className="flex items-center space-x-2">
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{grade} ({targetScore}%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {baseText}
                          </span>
                          {finalWeight > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto text-muted-foreground hover:text-foreground"
                              onClick={() => setExpandedGrade(isExpanded ? null : grade)}
                            >
                              <Info className="w-4 h-4" />
                              <span className="sr-only">Show final exam requirement</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      {isExpanded && finalExamInfo && (
                        <div className="px-2 py-1 mt-1 text-sm text-center text-gray-700 bg-gray-100 rounded-md border">
                          {finalExamInfo}
                        </div>
                      )}
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
