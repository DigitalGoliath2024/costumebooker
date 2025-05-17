import { STRIPE_PRODUCTS } from '../stripe-config';
import { useAuth } from '../contexts/AuthContext';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription', authToken: string) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      mode,
      success_url: `${window.location.origin}/dashboard?checkout=success`,
      cancel_url: `${window.location.origin}/dashboard?checkout=canceled`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const { url } = await response.json();
  return url;
}

export async function redirectToCheckout(productId: keyof typeof STRIPE_PRODUCTS, authToken: string) {
  const product = STRIPE_PRODUCTS[productId];
  if (!product) throw new Error('Invalid product ID');

  const checkoutUrl = await createCheckoutSession(product.priceId, product.mode, authToken);
  window.location.href = checkoutUrl;
}