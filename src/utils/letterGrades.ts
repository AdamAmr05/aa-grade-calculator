export interface LetterGrade {
  grade: string;
  minScore: number;
}

export const letterGradeScale: LetterGrade[] = [
  { grade: "A+", minScore: 94 },
  { grade: "A", minScore: 90 },
  { grade: "A-", minScore: 86 },
  { grade: "B+", minScore: 82 },
  { grade: "B", minScore: 78 },
  { grade: "B-", minScore: 74 },
  { grade: "C+", minScore: 70 },
  { grade: "C", minScore: 65 },
  { grade: "C-", minScore: 60 },
  { grade: "D+", minScore: 55 },
  { grade: "D", minScore: 50 },
  { grade: "F", minScore: 0 },
];

export const calculateOverallPointsNeededForGrade = (currentGrade: number): { grade: string; pointsNeeded: number }[] => {
  const goals = [];
  const sortedScale = [...letterGradeScale].sort((a, b) => b.minScore - a.minScore);

  for (const { grade, minScore } of sortedScale) {
    if (minScore > currentGrade) {
      const pointsNeeded = Number((minScore - currentGrade).toFixed(1));
      if (pointsNeeded > 0) {
        goals.push({
          grade: grade,
          pointsNeeded: minScore,
        });
      }
    }
  }
  return goals.sort((a, b) => a.pointsNeeded - b.pointsNeeded);
};

export const getLetterGrade = (score: number): string => {
  const sortedScale = [...letterGradeScale].sort((a, b) => b.minScore - a.minScore);
  for (const { grade, minScore } of sortedScale) {
    if (score >= minScore) {
      return grade;
    }
  }
  return "F";
};

// Function to calculate the final exam score needed for a target *overall* grade
export const calculateRequiredFinalScoreForTarget = (
  currentGradeWithoutFinal: number,
  finalWeight: number,
  targetOverallGrade: number
): number | null => { // Return null if impossible
  if (finalWeight <= 0 || finalWeight > 100) return null; // Can't calculate if no final weight

  const requiredScore = 
    ((targetOverallGrade - currentGradeWithoutFinal) / (finalWeight / 100));

  // Return null if the required score is impossible (e.g., > 100% or < 0%)
  // Allow slightly above 100 or below 0 due to floating point precision issues
  if (requiredScore > 100.01 || requiredScore < -0.01) {
      return null;
  }
  // Clamp to handle minor precision issues at the boundaries
  return Math.max(0, Math.min(100, requiredScore));
};
