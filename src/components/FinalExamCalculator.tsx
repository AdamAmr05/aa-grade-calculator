import React, { useMemo, useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLetterGrade } from "@/utils/letterGrades";
import { LetterGrade } from "@/utils/letterGrades";

interface FinalExamCalculatorProps {
  currentGrade: number;
  finalWeight: number;
  gradingScale: LetterGrade[];
}

export const FinalExamCalculator: React.FC<FinalExamCalculatorProps> = ({
  currentGrade,
  finalWeight,
  gradingScale,
}) => {
  const [targetType, setTargetType] = useState<"pass" | "letter">("pass");
  const [whatIfFinal, setWhatIfFinal] = useState<number>(Math.min(100, Math.max(0, 80)));
  const [targetLetter, setTargetLetter] = useState<string>("B");

  const targetOverall = useMemo(() => {
    if (targetType === "pass") return 50;
    const match = gradingScale.find(g => g.grade === targetLetter);
    return match ? match.minScore : 50;
  }, [targetType, targetLetter, gradingScale]);

  const requiredScore =
    finalWeight === 0
      ? 0
      : ((targetOverall - currentGrade) / (finalWeight / 100));
  
  const isPassing = currentGrade >= 50;
  const isImpossible = requiredScore > 100;

  // Calculate progress towards the 50% goal
  const progressPercentage = (currentGrade / 50) * 100;
  const clampedProgress = Math.max(0, Math.min(progressPercentage, 100));
  const percentageToGo = Math.max(0, 50 - currentGrade);

  const projectedOverall = useMemo(() => {
    return currentGrade + (finalWeight / 100) * whatIfFinal;
  }, [currentGrade, finalWeight, whatIfFinal]);

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Final Exam Calculator
        </CardTitle>
        <CardDescription>
          Calculate the score needed on your final exam to reach a goal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">Target</p>
            <div className="flex gap-2">
              <Select value={targetType} onValueChange={(v) => setTargetType(v as any)}>
                <SelectTrigger className="w-28"><SelectValue placeholder="Target" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass">Pass (50%)</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                </SelectContent>
              </Select>
              {targetType === "letter" && (
                <Select value={targetLetter} onValueChange={setTargetLetter}>
                  <SelectTrigger className="w-24"><SelectValue placeholder="Grade" /></SelectTrigger>
                  <SelectContent>
                    {gradingScale.sort((a,b)=>b.minScore-a.minScore).map(g => (
                      <SelectItem key={g.grade} value={g.grade}>{g.grade} ({g.minScore}%)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">What-if Final Score</p>
            <Slider value={[whatIfFinal]} min={0} max={100} step={1} onValueChange={(v) => setWhatIfFinal(v[0])} />
            <div className="text-sm text-muted-foreground">{whatIfFinal}% → Projected Overall: <span className="font-medium">{projectedOverall.toFixed(1)}%</span> ({getLetterGrade(projectedOverall, gradingScale)})</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-white/50 backdrop-blur border">
            <p className="text-sm font-medium mb-2">Current Grade</p>
            <p className="text-4xl font-bold">
              {currentGrade.toFixed(1)}%
              <span className="text-2xl font-semibold text-muted-foreground ml-2">
                ({getLetterGrade(currentGrade, gradingScale)})
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
                You need at least {requiredScore.toFixed(1)}% on your final to reach {targetType === "pass" ? "50% (pass)" : `${targetLetter}`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
