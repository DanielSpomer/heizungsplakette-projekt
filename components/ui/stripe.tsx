'use client'

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe as StripeType } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';

let stripePromise: Promise<StripeType | null>;

export function Stripe({ children }: { children: React.ReactNode }) {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }
    stripePromise.then(() => setStripeLoaded(true));
  }, []);

  if (!stripeLoaded) {
    return <div>Laden...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}

export function StripeCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    console.log('Zahlung wird verarbeitet...');
    setTimeout(() => {
      setIsProcessing(false);
      console.log('Zahlung abgeschlossen');
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Hier würden die Stripe-Elemente eingefügt werden */}
      <button type="submit" disabled={isProcessing}>
        {isProcessing ? 'Verarbeitung...' : 'Jetzt bezahlen'}
      </button>
    </form>
  );
}