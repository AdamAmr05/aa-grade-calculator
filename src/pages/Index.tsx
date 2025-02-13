
import React, { useState } from "react";
import { CourseComponentsList } from "@/components/CourseComponentsList";
import { FinalExamCalculator } from "@/components/FinalExamCalculator";
import { useToast } from "@/components/ui/use-toast";
import {
  CourseComponent,
  calculateOverallGrade,
  parseScore,
} from "@/utils/gradeCalculations";

const Index = () => {
  const [components, setComponents] = useState<CourseComponent[]>([]);
  const { toast } = useToast();

  const handleComponentChange = (newComponents: CourseComponent[]) => {
    try {
      // Validate scores
      newComponents.forEach(comp => {
        if (comp.score && !comp.isFinal) {
          parseScore(comp.score);
        }
      });
      setComponents(newComponents);
    } catch (error) {
      toast({
        title: "Invalid Input",
        description: "Please check your score format (use percentages or fractions)",
        variant: "destructive",
      });
    }
  };

  const currentGrade = calculateOverallGrade(components);
  const finalExam = components.find(comp => comp.isFinal);
  const finalWeight = finalExam?.weight || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight">
            Grade Ninja Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your course grades and determine what you need on your final
            exam to pass
          </p>
        </div>

        <div className="space-y-8 animate-slide-in">
          <CourseComponentsList
            components={components}
            onComponentChange={handleComponentChange}
          />

          <FinalExamCalculator
            currentGrade={currentGrade}
            finalWeight={finalWeight}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
