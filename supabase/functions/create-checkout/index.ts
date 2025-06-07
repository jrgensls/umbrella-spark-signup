
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

    // Check for Stripe secret key - try both possible names
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || Deno.env.get("Stripe secret key");
    if (!stripeSecretKey) {
      console.error("Stripe secret key not found in environment variables");
      console.log("Available env vars:", Object.keys(Deno.env.toObject()));
      throw new Error("Stripe configuration error - secret key not found");
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
      console.log("No existing customer found, will create new one during checkout");
    }

    // Create a one-time payment session with payment method saving enabled
    console.log("Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : registrationData.contactEmail,
      billing_address_collection: "auto", // Don't require billing address collection
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: "Umbrella Network Registration",
              description: "Setup Fee"
            },
            unit_amount: 100, // €1.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_intent_data: {
        setup_future_usage: "on_session", // Save payment method for future use
      },
      success_url: `${req.headers.get("origin")}/register?success=true`,
      cancel_url: `${req.headers.get("origin")}/register?canceled=true`,
      metadata: {
        company_name: registrationData.companyName,
        contact_person: registrationData.contactPersonName,
        preferred_location: registrationData.preferredLocation,
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
