
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
    // Allow partial fractions during editing
    if (parts.length === 1) return 0;
    if (parts.length !== 2) return 0;
    
    const numerator = parseFloat(parts[0].trim());
    const denominator = parseFloat(parts[1].trim());
    
    // During editing, one or both parts might be empty or invalid
    if (isNaN(numerator) || isNaN(denominator)) return 0;
    if (denominator === 0) return 0;
    
    return (numerator / denominator) * 100;
  }
  
  // Handle percentage format (e.g., "75%" or "75")
  const percentage = parseFloat(score.replace("%", ""));
  if (isNaN(percentage)) return 0;
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
