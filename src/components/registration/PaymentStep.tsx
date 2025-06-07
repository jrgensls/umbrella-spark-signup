
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RegistrationData } from '@/pages/Register';
import { CreditCard, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleStripeCheckout = async () => {
    setProcessing(true);
    
    try {
      const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout', {
        body: { registrationData: data }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (checkoutData?.url) {
        // Redirect to Stripe checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
      setProcessing(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        
        {/* Order Summary */}
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Setup Fee</span>
              <span>$99.00</span>
            </div>
            <div className="flex justify-between">
              <span>First Month</span>
              <span>$199.00</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>$298.00</span>
            </div>
          </div>
        </Card>

        {/* Registration Summary */}
        <Card className="p-4 bg-muted/50">
          <h4 className="font-semibold mb-3">Registration Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Company:</span>
              <span>{data.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span>Contact:</span>
              <span>{data.contactPersonName}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{data.contactEmail}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>{data.preferredLocation}</span>
            </div>
          </div>
        </Card>

        {/* Stripe Payment Button */}
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-semibold">Secure Payment with Stripe</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            You'll be redirected to Stripe's secure payment page to complete your registration.
          </p>
          
          <Button 
            onClick={handleStripeCheckout}
            disabled={processing}
            size="lg"
            className="w-full"
          >
            {processing ? 'Redirecting to Stripe...' : 'Pay with Stripe - $298.00'}
          </Button>
        </Card>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted with Stripe</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Complete payment above to finish registration
        </div>
      </div>
    </div>
  );
};
