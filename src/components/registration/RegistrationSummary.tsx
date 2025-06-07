
import React from 'react';
import { Card } from '@/components/ui/card';
import { RegistrationData } from '@/pages/Register';

interface RegistrationSummaryProps {
  data: RegistrationData;
}

export const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({ data }) => {
  return (
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
  );
};
