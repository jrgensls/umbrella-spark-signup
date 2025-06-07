
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RegistrationData } from '@/pages/Register';

interface StripePaymentButtonProps {
  data: RegistrationData;
}

export const StripePaymentButton: React.FC<StripePaymentButtonProps> = ({ data }) => {
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

  return (
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
        {processing ? 'Redirecting to Stripe...' : 'Activate payment method with Stripe - €1.00'}
      </Button>
    </Card>
  );
};
