
import React from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CourseComponent } from "@/utils/gradeCalculations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CourseComponentsListProps {
  components: CourseComponent[];
  onComponentChange: (components: CourseComponent[]) => void;
}

export const CourseComponentsList: React.FC<CourseComponentsListProps> = ({
  components,
  onComponentChange,
}) => {
  const addComponent = () => {
    const newComponent: CourseComponent = {
      id: crypto.randomUUID(),
      name: "",
      weight: 0,
      score: "",
      isFinal: false,
    };
    onComponentChange([...components, newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<CourseComponent>) => {
    onComponentChange(
      components.map((comp) =>
        comp.id === id ? { ...comp, ...updates } : comp
      )
    );
  };

  const removeComponent = (id: string) => {
    onComponentChange(components.filter((comp) => comp.id !== id));
  };

  const totalWeight = components.reduce((sum, comp) => sum + comp.weight, 0);

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          Course Components
        </CardTitle>
        <CardDescription>
          Add your course components and their weights below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {components.map((component) => (
          <div
            key={component.id}
            className={cn(
              "p-4 rounded-lg transition-all duration-300 animate-slide-in",
              "bg-white/50 backdrop-blur border shadow-sm"
            )}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`name-${component.id}`}>Component Name</Label>
                <Input
                  id={`name-${component.id}`}
                  value={component.name}
                  onChange={(e) =>
                    updateComponent(component.id, { name: e.target.value })
                  }
                  placeholder="e.g., Midterm"
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`weight-${component.id}`}>Weight (%)</Label>
                <Input
                  id={`weight-${component.id}`}
                  type="number"
                  value={component.weight}
                  onChange={(e) =>
                    updateComponent(component.id, {
                      weight: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max="100"
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`score-${component.id}`}>
                  Score (% or fraction)
                </Label>
                <Input
                  id={`score-${component.id}`}
                  value={component.score}
                  onChange={(e) =>
                    updateComponent(component.id, { score: e.target.value })
                  }
                  placeholder="e.g., 75% or 15/20"
                  disabled={component.isFinal}
                  className="bg-white/50"
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={component.isFinal}
                    onCheckedChange={(checked) =>
                      updateComponent(component.id, { isFinal: checked })
                    }
                  />
                  <Label>Final Exam</Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeComponent(component.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={addComponent}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" /> Add Component
          </Button>
          <Badge variant={totalWeight === 100 ? "default" : "secondary"}>
            Total Weight: {totalWeight}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
