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
import { Checkbox } from '@/components/ui/checkbox';
import { RegistrationData } from '@/pages/Register';

const companyDetailsSchema = z.object({
  companyName: z.string().optional(),
  contactPersonName: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  legalRepresentative: z.boolean(),
});

interface CompanyDetailsStepProps {
  data: RegistrationData;
  onUpdate: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
}

export const CompanyDetailsStep: React.FC<CompanyDetailsStepProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const form = useForm<z.infer<typeof companyDetailsSchema>>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      companyName: data.companyName,
      contactPersonName: data.contactPersonName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      legalRepresentative: data.legalRepresentative,
    },
  });

  const onSubmit = (values: z.infer<typeof companyDetailsSchema>) => {
    onUpdate(values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Information</h3>
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPersonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact person name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter contact email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="legalRepresentative"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Legal Representative
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};
