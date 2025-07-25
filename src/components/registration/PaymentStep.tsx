
import React from 'react';
import { Button } from '@/components/ui/button';
import { RegistrationData } from '@/pages/Register';
import { useToast } from '@/hooks/use-toast';
import { OrderSummary } from './OrderSummary';
import { RegistrationSummary } from './RegistrationSummary';
import { StripePaymentButton } from './StripePaymentButton';
import { SecurityNotice } from './SecurityNotice';

interface PaymentStepProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onComplete: () => void;
  onPrevious: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  data,
  onUpdate,
  onComplete,
  onPrevious,
}) => {
  const { toast } = useToast();

  // Check if we're returning from a successful payment
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      onUpdate({ paymentCompleted: true });
      onComplete();
      toast({
        title: "Payment Successful!",
        description: "Your registration has been completed successfully."
      });
    } else if (urlParams.get('canceled') === 'true') {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again when ready.",
        variant: "destructive"
      });
    }
  }, [onUpdate, onComplete, toast]);

  // Validate required fields before allowing payment
  const isDataComplete = () => {
    return (
      data.companyName.trim() !== '' &&
      data.contactPersonName.trim() !== '' &&
      data.contactEmail.trim() !== '' &&
      data.contactPhone.trim() !== '' &&
      data.preferredLocation.trim() !== ''
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        
        <OrderSummary />
        <RegistrationSummary data={data} />
        
        {isDataComplete() ? (
          <StripePaymentButton data={data} />
        ) : (
          <div className="text-center p-6 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-2">
              Please complete all required fields in the previous steps before proceeding with payment.
            </p>
            <Button variant="outline" onClick={onPrevious}>
              Go Back to Complete Registration
            </Button>
          </div>
        )}
        
        <SecurityNotice />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        {isDataComplete() ? (
          <div className="text-sm text-muted-foreground">
            Complete payment above to finish registration
          </div>
        ) : (
          <div className="text-sm text-destructive">
            Please complete all required fields first
          </div>
        )}
      </div>
    </div>
  );
};
