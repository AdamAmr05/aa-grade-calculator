export interface LetterGrade {
  grade: string;
  minScore: number;
}

export const calculateOverallPointsNeededForGrade = (
  currentGrade: number,
  scale: LetterGrade[]
): { grade: string; pointsNeeded: number; targetScore: number }[] => {
  const goals = [];
  const sortedScale = [...scale].sort((a, b) => b.minScore - a.minScore);

  for (const { grade, minScore } of sortedScale) {
    if (minScore > currentGrade) {
      const pointsNeeded = Number((minScore - currentGrade).toFixed(1));
      if (pointsNeeded > 0) {
        goals.push({
          grade: grade,
          pointsNeeded: pointsNeeded,
          targetScore: minScore,
        });
      }
    }
  }
  return goals;
};

export const getLetterGrade = (score: number, scale: LetterGrade[]): string => {
  const sortedScale = [...scale].sort((a, b) => b.minScore - a.minScore);
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
