
export interface LetterGrade {
  grade: string;
  minimum: number;
}

export const letterGrades: LetterGrade[] = [
  { grade: "A+", minimum: 94 },
  { grade: "A", minimum: 90 },
  { grade: "A-", minimum: 86 },
  { grade: "B+", minimum: 82 },
  { grade: "B", minimum: 78 },
  { grade: "B-", minimum: 74 },
  { grade: "C+", minimum: 70 },
  { grade: "C", minimum: 65 },
  { grade: "C-", minimum: 60 },
  { grade: "D+", minimum: 55 },
  { grade: "D", minimum: 50 }
];

export const calculatePointsNeeded = (currentGrade: number): { grade: string; pointsNeeded: number }[] => {
  return letterGrades
    .filter(lg => lg.minimum > currentGrade)
    .map(lg => ({
      grade: lg.grade,
      pointsNeeded: Number((lg.minimum - currentGrade).toFixed(1))
    }));
};
