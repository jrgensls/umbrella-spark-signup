
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RegistrationData } from '@/pages/Register';
import { CreditCard, Calendar, Lock } from 'lucide-react';

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiryMonth: z.string().min(1, 'Please select expiry month'),
  expiryYear: z.string().min(1, 'Please select expiry year'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

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

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onUpdate({ paymentCompleted: true });
      onComplete();
      setProcessing(false);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    form.setValue('cardNumber', formatted.replace(/\s/g, ''));
    e.target.value = formatted;
  };

  // Generate years for expiry (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = [
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Payment Form */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        onChange={handleCardNumberChange}
                      />
                      <CreditCard className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="123"
                          maxLength={4}
                          {...field}
                        />
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? 'Processing...' : 'Complete Registration'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
