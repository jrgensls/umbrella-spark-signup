
import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, title: 'Company Details' },
  { number: 2, title: 'Contact Details' },
  { number: 3, title: 'Coworking Preferences' },
  { number: 4, title: 'Payment' }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle and Title Container */}
          <div className="relative flex flex-col items-center">
            {/* Step Title - moved above the circle */}
            <div className="mb-2 text-center">
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  step.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
            
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step.number < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step.number === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground border-2 border-muted'
              }`}
            >
              {step.number < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
          </div>
          
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`h-px w-20 mx-4 transition-colors ${
                step.number < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
