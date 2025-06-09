
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome to the Umbrella Network!
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Confirmation Email</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a confirmation email with your registration details shortly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Account Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team will contact you within 24 hours to complete your account setup.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Access a workspace nearby</h3>
                  <p className="text-sm text-muted-foreground">
                    Once setup is complete, you and your colleagues will have access to coworking spaces across the country, near your home.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')} 
              size="lg"
              className="w-full"
            >
              Return to Home
            </Button>
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@umbrellanetwork.com" className="text-primary hover:underline">
                support@umbrellanetwork.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
