
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
  companySize: z.string().optional(),
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
      companySize: data.companySize,
    },
  });

  const onSubmit = (values: z.infer<typeof preferencesSchema>) => {
    onUpdate(values);
    onNext();
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
                    <SelectItem value="unknown">I don't know yet</SelectItem>
                    <SelectItem value="kirstinelund">Kirstinelund (Lystrup)</SelectItem>
                    <SelectItem value="mollerup-gods">Møllerup Gods (Rønde)</SelectItem>
                    <SelectItem value="bakkegaarden">Bakkegaarden (Aarhus)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 employees</SelectItem>
                    <SelectItem value="6-15">6-15 employees</SelectItem>
                    <SelectItem value="16-50">16-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="200+">200+ employees</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">What's Included:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Work near your ideal location</li>
            <li>• 24/7 reservation to all Umbrella Network locations</li>
            <li>• High-speed WiFi and printing facilities</li>
            <li>• Meeting room or flex desk options</li>
            <li>• Lunch and other services available (depending on coworking location)</li>
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
