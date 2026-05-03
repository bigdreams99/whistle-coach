// Vercel Serverless Function: Stripe Webhook Handler
// POST /api/webhook
//
// Requires environment variables:
//   STRIPE_SECRET_KEY       - Your Stripe secret key
//   STRIPE_WEBHOOK_SECRET   - Webhook signing secret (whsec_...)
//
// Note: For a client-side app with no database, this webhook primarily
// serves as a safety net and logging. The client uses localStorage for
// Pro status, verified against Stripe on each session load via /api/status.

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Vercel requires raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log(
        `Checkout completed for customer ${session.customer}, email: ${session.customer_email || session.customer_details?.email}`
      );
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      console.log(
        `Subscription ${subscription.id} updated. Status: ${subscription.status}`
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.log(
        `Subscription ${subscription.id} cancelled. Customer: ${subscription.customer}`
      );
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log(
        `Payment failed for customer ${invoice.customer}. Invoice: ${invoice.id}`
      );
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
