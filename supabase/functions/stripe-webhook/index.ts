
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    console.log("Stripe webhook received");
    
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      console.log("Available env vars:", Object.keys(Deno.env.toObject()));
      throw new Error("Stripe configuration error - STRIPE_SECRET_KEY not found");
    }
    console.log("Stripe secret key found");

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return new Response("No signature", { status: 400 });
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event;

    if (webhookSecret) {
      try {
        // Use the raw body and signature for verification
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        console.log("Webhook signature verified successfully");
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new Response("Invalid signature", { status: 400 });
      }
    } else {
      // If no webhook secret is set, parse the body directly (less secure)
      console.log("No webhook secret set, parsing body directly");
      event = JSON.parse(body);
    }

    console.log("Event type:", event.type);

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Payment successful for session:", session.id);

      // Get customer details
      const customer = await stripe.customers.retrieve(session.customer as string);
      console.log("Retrieved customer:", customer.id);
      
      // Prepare data to send to your webhook
      const webhookData = {
        stripe_session_id: session.id,
        customer_id: session.customer,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: (customer as Stripe.Customer).email,
        customer_name: (customer as Stripe.Customer).name,
        metadata: session.metadata,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending data to external webhook:", webhookData);

      // Send POST request to your webhook
      try {
        const response = await fetch("https://theproductagency.app.n8n.cloud/webhook-test/81e5a5ad-eb00-4f6c-8e49-6069180e3026", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookData),
        });

        console.log("Webhook response status:", response.status);
        
        if (response.ok) {
          console.log("Successfully sent data to external webhook");
        } else {
          const responseText = await response.text();
          console.error("Failed to send data to external webhook:", response.status, response.statusText, responseText);
        }
      } catch (fetchError) {
        console.error("Error sending to external webhook:", fetchError);
      }
    } else {
      console.log("Event type not handled:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Webhook processing failed" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
