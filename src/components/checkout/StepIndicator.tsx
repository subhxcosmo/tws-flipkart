import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="bg-card px-4 py-5">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            {/* Step with Circle and Label */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  index < currentStep
                    ? "border-2 border-primary bg-transparent text-primary"
                    : index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-muted-foreground/30 bg-transparent text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5 stroke-[2.5]" />
                ) : (
                  index + 1
                )}
              </div>
              {/* Label */}
              <span
                className={`mt-2 text-xs font-medium ${
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
                className={`h-0.5 w-16 mx-2 -mt-5 ${
                  index < currentStep ? "bg-primary" : "bg-primary"
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
