
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
      console.log('Starting Stripe checkout with data:', data);
      
      const { data: checkoutData, error } = await supabase.functions.invoke('create-checkout', {
        body: { registrationData: data }
      });

      console.log('Checkout response:', { checkoutData, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Unknown error occurred');
      }

      if (checkoutData?.url) {
        console.log('Redirecting to Stripe checkout:', checkoutData.url);
        // Redirect to Stripe checkout
        window.location.href = checkoutData.url;
      } else {
        console.error('No checkout URL received:', checkoutData);
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setProcessing(false);
      
      let errorMessage = 'Failed to create checkout session. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('email')) {
          errorMessage = 'Invalid email address. Please check your contact email and try again.';
        } else if (error.message.includes('API key')) {
          errorMessage = 'Payment system configuration error. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
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
        {processing ? 'Redirecting to Stripe...' : 'Activate payment method with Stripe - kr 5,00'}
      </Button>
    </Card>
  );
};
