import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
});

/**
 * Create a Stripe Payment Intent for an order.
 * Amount should be in the smallest currency unit (paise for INR).
 */
export async function createPaymentIntent(
  amountInPaise: number,
  metadata: Record<string, string> = {}
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });

  return paymentIntent;
}

/**
 * Verify a Stripe webhook signature.
 * Must use raw body (string) — do NOT parse JSON before verification.
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ""
  );
}
