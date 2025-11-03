import { Button } from "@/components/ui/button";
import { Star, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface BestInClassFilterProps {
  onFilterApply: (enabled: boolean) => void;
}

export const BestInClassFilter = ({ onFilterApply }: BestInClassFilterProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onFilterApply(newState);
  };

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <Button
        variant={isActive ? "default" : "outline"}
        onClick={handleToggle}
        className="hover-scale"
      >
        <Star className={`h-4 w-4 mr-2 ${isActive ? 'fill-current' : ''}`} />
        Best-in-Class Filter
      </Button>
      {isActive && (
        <Badge variant="default" className="animate-scale-in">
          <Filter className="h-3 w-3 mr-1" />
          Active
        </Badge>
      )}
    </div>
  );
};
