
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const preferencesSchema = z.object({
  preferredLocation: z.string().optional(),
  startDate: z.string().optional(),
});

interface CoworkingPreferencesStepProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const CoworkingPreferencesStep: React.FC<CoworkingPreferencesStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const form = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredLocation: data.preferredLocation,
      startDate: data.startDate,
    },
  });

  const onSubmit = (values: z.infer<typeof preferencesSchema>) => {
    onUpdate(values);
    onNext();
  };

  // Generate date options (next 6 months)
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 180; i += 30) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    return dates;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Coworking Preferences</h3>
          
          <FormField
            control={form.control}
            name="preferredLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new-york">New York, NY</SelectItem>
                    <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                    <SelectItem value="london">London, UK</SelectItem>
                    <SelectItem value="toronto">Toronto, Canada</SelectItem>
                    <SelectItem value="berlin">Berlin, Germany</SelectItem>
                    <SelectItem value="sydney">Sydney, Australia</SelectItem>
                    <SelectItem value="singapore">Singapore</SelectItem>
                    <SelectItem value="tokyo">Tokyo, Japan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">What's Included:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• 24/7 access to all Umbrella Network locations</li>
            <li>• High-speed WiFi and printing facilities</li>
            <li>• Meeting room credits included</li>
            <li>• Complimentary beverages and snacks</li>
            <li>• Networking events and workshops</li>
            <li>• Professional mailing address</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};
