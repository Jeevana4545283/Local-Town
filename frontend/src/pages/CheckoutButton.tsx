import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key_here');

export function CheckoutButton({ amount }: { amount: number }) {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    
    // Call your backend to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    // Stripe typings vary; for now we keep it safe by calling via `any`.
    if (stripe) {
      const stripeAny = stripe as any
      const result = await stripeAny.redirectToCheckout({
        sessionId: session.id,
      })
      if (result?.error) console.error(result.error)
    }
  };

  return (
    <button onClick={handleCheckout} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
      Pay ₹{amount}
    </button>
  );
}