
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
    const { registrationData } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this email
    const customers = await stripe.customers.list({ 
      email: registrationData.contactEmail, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : registrationData.contactEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Umbrella Network Registration",
              description: "Setup Fee + First Month"
            },
            unit_amount: 29800, // $298.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/register?success=true`,
      cancel_url: `${req.headers.get("origin")}/register?canceled=true`,
      metadata: {
        company_name: registrationData.companyName,
        contact_person: registrationData.contactPersonName,
        preferred_location: registrationData.preferredLocation,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
