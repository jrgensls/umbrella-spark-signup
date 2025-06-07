
import React from 'react';
import { Lock } from 'lucide-react';

export const SecurityNotice: React.FC = () => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Your payment information is secure and encrypted with Stripe</span>
      </div>
    </div>
  );
};
