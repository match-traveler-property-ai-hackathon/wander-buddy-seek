import { Progress } from "@/components/ui/progress";
import { Check, Loader2, AlertCircle } from "lucide-react";

interface SearchProgressProps {
  currentStage: 'ai' | 'mcp' | 'sorting' | 'complete' | 'error';
  errorMessage?: string | null;
}

const SearchProgress = ({ currentStage, errorMessage }: SearchProgressProps) => {
  const stages = [
    { id: 'ai', label: 'Checking AI', value: 33 },
    { id: 'mcp', label: 'Checking Hostelworld', value: 66 },
    { id: 'sorting', label: 'Sorting results', value: 100 }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === currentStage);
  const progressValue = currentStageIndex >= 0 ? stages[currentStageIndex].value : 0;
  const isError = currentStage === 'error';

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      <Progress 
        value={isError ? progressValue : progressValue} 
        className={`h-2 ${isError ? '[&>div]:bg-destructive' : ''}`}
      />
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isComplete = currentStageIndex > index;
          const isFailed = isError && (isActive || currentStageIndex === index);
          
          return (
            <div key={stage.id} className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                isFailed
                  ? 'bg-destructive border-destructive'
                  : isComplete 
                    ? 'bg-primary border-primary' 
                    : isActive 
                      ? 'border-primary' 
                      : 'border-muted'
              }`}>
                {isFailed ? (
                  <AlertCircle className="w-4 h-4 text-destructive-foreground" />
                ) : isComplete ? (
                  <Check className="w-4 h-4 text-primary-foreground" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                )}
              </div>
              
              <span className={`text-sm transition-colors ${
                isFailed
                  ? 'text-destructive font-medium'
                  : isActive 
                    ? 'text-foreground font-medium' 
                    : isComplete 
                      ? 'text-muted-foreground' 
                      : 'text-muted-foreground'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {isError && errorMessage && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive font-medium">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchProgress;
