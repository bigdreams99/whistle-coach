// Vercel Serverless Function: Check Subscription Status
// GET /api/status?email=user@example.com
//
// Requires environment variables:
//   STRIPE_SECRET_KEY - Your Stripe secret key
//
// Returns the subscription status for a given email address.
// The client calls this on app load to verify Pro status.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  try {
    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(200).json({
        isPro: false,
        status: "no_customer",
      });
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 5,
    });

    // Check for active or trialing subscription
    const activeSub = subscriptions.data.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    if (activeSub) {
      return res.status(200).json({
        isPro: true,
        status: activeSub.status,
        currentPeriodEnd: activeSub.current_period_end,
        cancelAtPeriodEnd: activeSub.cancel_at_period_end,
        trialEnd: activeSub.trial_end,
      });
    }

    // Check for past due (grace period)
    const pastDueSub = subscriptions.data.find(
      (sub) => sub.status === "past_due"
    );

    if (pastDueSub) {
      return res.status(200).json({
        isPro: true, // Keep Pro access during grace period
        status: "past_due",
        currentPeriodEnd: pastDueSub.current_period_end,
      });
    }

    return res.status(200).json({
      isPro: false,
      status: "inactive",
    });
  } catch (err) {
    console.error("Status check error:", err.message);
    return res.status(500).json({ error: "Failed to check subscription status" });
  }
}
