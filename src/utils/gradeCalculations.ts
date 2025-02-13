
export interface CourseComponent {
  id: string;
  name: string;
  weight: number;
  score: string;
  isFinal?: boolean;
}

export const parseScore = (score: string): number => {
  if (!score.trim()) return 0;
  
  // Handle fraction format (e.g., "15/20")
  if (score.includes("/")) {
    const parts = score.split("/");
    if (parts.length !== 2) {
      throw new Error("Invalid fraction format");
    }
    const [numerator, denominator] = parts.map(num => parseFloat(num.trim()));
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
      throw new Error("Invalid fraction format");
    }
    return (numerator / denominator) * 100;
  }
  
  // Handle percentage format (e.g., "75%" or "75")
  const percentage = parseFloat(score.replace("%", ""));
  if (isNaN(percentage)) {
    throw new Error("Invalid percentage format");
  }
  return percentage;
};

export const calculateOverallGrade = (components: CourseComponent[]): number => {
  let totalWeight = 0;
  let weightedSum = 0;

  components.forEach(component => {
    if (component.score && !component.isFinal) {
      const weight = component.weight / 100;
      const score = parseScore(component.score);
      weightedSum += score * weight;
      totalWeight += weight;
    }
  });

  return totalWeight === 0 ? 0 : weightedSum;
};

export const calculateRequiredFinalScore = (
  currentGrade: number,
  finalWeight: number,
  targetGrade: number = 50
): number => {
  if (finalWeight === 0) return 0;
  return ((targetGrade - currentGrade) / (finalWeight / 100));
};
