
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
        description: "Please check your score format (use percentages or fractions e.g., 75% or 15/20)",
        variant: "destructive",
      });
    }
  };

  const currentGrade = calculateOverallGrade(components);
  const finalExam = components.find(comp => comp.isFinal);
  const finalWeight = finalExam?.weight || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 relative pb-16">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Grade Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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

        <div className="absolute bottom-0 left-0 right-0 text-center py-4">
          <p className="text-sm text-gray-500 font-light tracking-wide animate-fade-in">
            Created by Adam
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
