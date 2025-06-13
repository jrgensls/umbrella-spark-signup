
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting checkout session creation...");

    const { registrationData } = await req.json();
    console.log("Registration data received:", registrationData);

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      throw new Error("Stripe configuration error - STRIPE_SECRET_KEY not found");
    }
    console.log("Stripe secret key found");

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer already exists
    console.log("Checking for existing customer with email:", registrationData.contactEmail);
    const existingCustomers = await stripe.customers.list({
      email: registrationData.contactEmail,
      limit: 1,
    });

    let customerId;
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      console.log("Creating new Stripe customer...");
      const customer = await stripe.customers.create({
        email: registrationData.contactEmail,
        name: registrationData.contactPersonName,
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    console.log("Creating Stripe checkout session...");

    // Prepare metadata for the session
    const metadata = {
      company_name: registrationData.companyName || '',
      contact_person_name: registrationData.contactPersonName || '',
      contact_email: registrationData.contactEmail || '',
      contact_phone: registrationData.contactPhone || '',
      vat_tax_number: registrationData.vatTaxNumber || '',
      organization_number: registrationData.organizationNumber || '',
      legal_representative: registrationData.legalRepresentative ? 'true' : 'false',
      billing_street: registrationData.billingAddress?.street || '',
      billing_city: registrationData.billingAddress?.city || '',
      billing_postal_code: registrationData.billingAddress?.postalCode || '',
      billing_country: registrationData.billingAddress?.country || '',
      additional_contact_name: registrationData.additionalBillingContact?.name || '',
      additional_contact_email: registrationData.additionalBillingContact?.email || '',
      additional_contact_phone: registrationData.additionalBillingContact?.phone || '',
      preferred_location: registrationData.preferredLocation || '',
      company_size: registrationData.companySize || '',
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "dkk",
            product_data: {
              name: "Co-create Network Registration",
              description: "Access to coworking spaces in the Umbrella Network",
            },
            unit_amount: 500, // 5.00 DKK in øre
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/register`,
      metadata: metadata,
    });

    console.log("Checkout session created successfully:", session.id);
    console.log("Checkout URL:", session.url);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to create checkout session" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
