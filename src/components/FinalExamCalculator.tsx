import React from "react";
import { Calculator, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLetterGrade } from "@/utils/letterGrades";

interface FinalExamCalculatorProps {
  currentGrade: number;
  finalWeight: number;
}

export const FinalExamCalculator: React.FC<FinalExamCalculatorProps> = ({
  currentGrade,
  finalWeight,
}) => {
  const requiredScore =
    finalWeight === 0
      ? 0
      : ((50 - currentGrade) / (finalWeight / 100));
  
  const isPassing = currentGrade >= 50;
  const isImpossible = requiredScore > 100;

  // Calculate progress towards the 50% goal
  const progressPercentage = (currentGrade / 50) * 100;
  const clampedProgress = Math.max(0, Math.min(progressPercentage, 100));
  const percentageToGo = Math.max(0, 50 - currentGrade);

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Final Exam Calculator
        </CardTitle>
        <CardDescription>
          Calculate the score needed on your final exam to pass
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-white/50 backdrop-blur border">
            <p className="text-sm font-medium mb-2">Current Grade</p>
            <p className="text-4xl font-bold">
              {currentGrade.toFixed(1)}%
              <span className="text-2xl font-semibold text-muted-foreground ml-2">
                ({getLetterGrade(currentGrade)})
              </span>
            </p>
          </div>
          <div className="p-4 rounded-lg bg-white/50 backdrop-blur border">
            <p className="text-sm font-medium mb-2">Final Exam Weight</p>
            <p className="text-2xl font-bold">{finalWeight}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress to Passing (50%)</span>
            <span className="text-sm font-medium">
              {isPassing ? "Passed!" : `${percentageToGo.toFixed(1)}% to go`}
            </span>
          </div>
          <Progress value={clampedProgress} />
        </div>

        <div className="p-6 rounded-lg bg-white/50 backdrop-blur border">
          {isPassing ? (
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-green-600">
                Congratulations!
              </p>
              <p>You're already passing with a {currentGrade.toFixed(1)}%</p>
            </div>
          ) : isImpossible ? (
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-red-600">
                Unfortunately...
              </p>
              <p>
                It's not mathematically possible to reach a passing grade with the
                current scores
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl font-bold">
                  {requiredScore.toFixed(1)}%
                </div>
                <ArrowRight className="w-6 h-6" />
                <div className="text-lg">Needed on Final</div>
              </div>
              <p className="text-sm text-muted-foreground">
                You need to score at least {requiredScore.toFixed(1)}% on your
                final exam to pass the course
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
