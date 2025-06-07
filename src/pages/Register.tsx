import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CompanyDetailsStep } from '@/components/registration/CompanyDetailsStep';
import { ContactDetailsStep } from '@/components/registration/ContactDetailsStep';
import { CoworkingPreferencesStep } from '@/components/registration/CoworkingPreferencesStep';
import { PaymentStep } from '@/components/registration/PaymentStep';
import { StepIndicator } from '@/components/registration/StepIndicator';
import { useToast } from '@/hooks/use-toast';

export interface RegistrationData {
  // Company Information
  companyName: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone: string;
  vatTaxNumber: string;
  organizationNumber: string;
  legalRepresentative: boolean;
  
  // Billing Data
  billingAddress: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  additionalBillingContact: {
    name?: string;
    email?: string;
    phone?: string;
  };
  
  // Coworking Preferences
  preferredLocation: string;
  startDate: string;
  
  // Payment
  paymentCompleted: boolean;
}

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    companyName: '',
    contactPersonName: '',
    contactEmail: '',
    contactPhone: '',
    vatTaxNumber: '',
    organizationNumber: '',
    legalRepresentative: false,
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    additionalBillingContact: {
      name: '',
      email: '',
      phone: ''
    },
    preferredLocation: '',
    startDate: '',
    paymentCompleted: false
  });

  const { toast } = useToast();
  const totalSteps = 4;

  const updateRegistrationData = (stepData: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Progress Saved",
        description: "Your information has been saved."
      });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Registration Complete!",
      description: "Welcome to the Umbrella Network!"
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyDetailsStep
            data={registrationData}
            onUpdate={updateRegistrationData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <ContactDetailsStep
            data={registrationData}
            onUpdate={updateRegistrationData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 3:
        return (
          <CoworkingPreferencesStep
            data={registrationData}
            onUpdate={updateRegistrationData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 4:
        return (
          <PaymentStep
            data={registrationData}
            onUpdate={updateRegistrationData}
            onComplete={handleSubmit}
            onPrevious={previousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Section */}
        <div className="mb-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          <div className="mt-4">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>
        </div>

        {/* Form Section */}
        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Register Your Company
            </h1>
            <p className="text-muted-foreground mt-2">
              Join the Umbrella Network and unlock premium coworking spaces worldwide
            </p>
          </div>

          {renderCurrentStep()}
        </Card>
      </div>
    </div>
  );
};

export default Register;
