
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const OrderSummary: React.FC = () => {
  return (
    <Card className="p-4 bg-muted/50">
      <h4 className="font-semibold mb-3">Order Summary</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Setup Fee</span>
          <span>kr 1,00</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>kr 1,00</span>
        </div>
      </div>
    </Card>
  );
};
