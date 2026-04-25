// Vercel Serverless Function: Create Stripe Checkout Session
// POST /api/create-checkout-session
//
// Requires environment variables:
//   STRIPE_SECRET_KEY - Your Stripe secret key (sk_test_... or sk_live_...)
//   STRIPE_PRICE_ID   - The Stripe Price ID for Pro Annual ($49.99/yr)

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { priceId, email, successUrl, cancelUrl } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Use the env variable price ID if the client sends the placeholder
    const resolvedPriceId = priceId === "price_pro_annual"
      ? process.env.STRIPE_PRICE_ID
      : priceId;

    if (!resolvedPriceId || resolvedPriceId.startsWith("price_YOUR")) {
      return res.status(400).json({
        error: "Stripe is not configured yet. Please set up your Stripe products.",
      });
    }

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    let customerId;
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    }

    // Create checkout session
    const sessionConfig = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}?checkout=success`,
      cancel_url: cancelUrl || `${req.headers.origin}?checkout=cancel`,
      subscription_data: {
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
    };

    // Attach to existing customer or pre-fill email
    if (customerId) {
      sessionConfig.customer = customerId;
    } else {
      sessionConfig.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ sessionUrl: session.url });
  } catch (err) {
    console.error("Checkout session error:", err.message);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
