
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, CreditCard } from 'lucide-react';
import { RegistrationData } from '@/pages/Register';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const getMembershipPrice = () => {
    const prices: Record<string, number> = {
      'hot-desk': 99,
      'dedicated-desk': 199,
      'private-office': 399,
      'team-office': 999,
    };
    return prices[data.membershipType] || 99;
  };

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate Stripe checkout process
    try {
      // In a real application, you would integrate with Stripe here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onUpdate({ paymentCompleted: true });
      
      toast({
        title: "Payment Successful!",
        description: "Your membership has been activated."
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const membershipTypeDisplay = data.membershipType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Details</h3>
        
        {/* Order Summary */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Order Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Company:</span>
              <span className="font-medium">{data.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">
                {data.preferredLocation.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Membership:</span>
              <span className="font-medium">{membershipTypeDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span className="font-medium">
                {new Date(data.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Monthly Total:</span>
                <span>${getMembershipPrice()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Payment Method</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">Credit Card</div>
                <div className="text-sm text-muted-foreground">
                  Secure payment via Stripe
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </Card>

        {/* Terms */}
        <div className="bg-muted p-4 rounded-lg text-sm">
          <p className="mb-2">
            <strong>Terms & Conditions:</strong>
          </p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Monthly membership fee will be charged automatically</li>
            <li>• 30-day notice required for cancellation</li>
            <li>• Setup fee of $50 applies to all new memberships</li>
            <li>• Access cards will be issued within 24 hours</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={handleStripeCheckout}
          disabled={isProcessing}
          className="min-w-[150px]"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Pay $${getMembershipPrice()}/month`
          )}
        </Button>
      </div>
    </div>
  );
};
