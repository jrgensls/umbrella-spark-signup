
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
      console.log("Available env vars:", Object.keys(Deno.env.toObject()));
      throw new Error("Stripe configuration error - STRIPE_SECRET_KEY not found");
    }
    console.log("Stripe secret key found");

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this email
    console.log("Checking for existing customer with email:", registrationData.contactEmail);
    const customers = await stripe.customers.list({ 
      email: registrationData.contactEmail, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      // Create a new customer
      console.log("Creating new Stripe customer...");
      const customer = await stripe.customers.create({
        email: registrationData.contactEmail,
        name: registrationData.contactPersonName,
        metadata: {
          company_name: registrationData.companyName,
          contact_person: registrationData.contactPersonName,
          preferred_location: registrationData.preferredLocation,
        },
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    // Create a one-time payment session with payment method saving enabled
    console.log("Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: "auto", // Don't require billing address collection
      line_items: [
        {
          price_data: {
            currency: "dkk",
            product_data: { 
              name: "Umbrella Network Registration",
              description: "Setup Fee"
            },
            unit_amount: 100, // kr 1,00 in øre (Danish Krone cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        setup_future_usage: "on_session", // Save payment method for future use
      },
      success_url: `${req.headers.get("origin")}/payment-success`,
      cancel_url: `${req.headers.get("origin")}/register?canceled=true`,
      metadata: {
        company_name: registrationData.companyName,
        contact_person: registrationData.contactPersonName,
        contact_email: registrationData.contactEmail,
        contact_phone: registrationData.contactPhone,
        vat_tax_number: registrationData.vatTaxNumber,
        organization_number: registrationData.organizationNumber,
        preferred_location: registrationData.preferredLocation,
        start_date: registrationData.startDate,
        billing_street: registrationData.billingAddress.street || "",
        billing_city: registrationData.billingAddress.city || "",
        billing_postal_code: registrationData.billingAddress.postalCode || "",
        billing_country: registrationData.billingAddress.country || "",
      },
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
