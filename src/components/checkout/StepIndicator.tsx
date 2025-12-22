import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            {/* Step Circle */}
            <div className="flex items-center gap-1.5">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full text-2xs font-bold ${
                  index < currentStep
                    ? "bg-success text-success-foreground"
                    : index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-3 w-3" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  index <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 ${
                  index < currentStep ? "bg-success" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
