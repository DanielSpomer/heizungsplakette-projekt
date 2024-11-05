'use client';

import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripePaymentElementOptions, StripeError } from '@stripe/stripe-js'; // Importiere StripeError
import { useState, useEffect } from 'react';

// Lade Stripe mit deinem veröffentlichten Schlüssel
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Holen des client_secret vom Backend
  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000 }), // Beispiel: 50,00 EUR
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        setErrorMessage('Fehler beim Laden des Payment Intents.');
        console.error('Error:', error);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    const stripe = await stripePromise;
    const elements = useElements();

    if (!stripe || !elements) {
      setErrorMessage('Stripe ist nicht geladen.');
      setIsProcessing(false);
      return;
    }

    // Bestätige die Zahlung
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/confirmation', // Weiterleitung nach erfolgreicher Zahlung
      },
    });

    // Typ Narrowing verwenden, um sicherzustellen, dass TypeScript das Ergebnis korrekt versteht
    if (result.error) {
      // Falls ein Fehler auftritt, behandeln wir diesen hier
      setErrorMessage(result.error.message || 'Fehler bei der Zahlung.');
      setIsProcessing(false);
   /* } else if ('paymentIntent' in result) {
      // Wenn das `paymentIntent`-Objekt vorhanden ist, ist die Zahlung erfolgreich
      console.log('Zahlung erfolgreich:', result.paymentIntent);
      setIsProcessing(false);
      window.location.href = '/confirmation'; // Weiterleitung nach erfolgreicher Zahlung*/
    } else {
      // Falls weder ein Fehler noch ein paymentIntent vorliegt, sollte dies abgefangen werden
      setErrorMessage('Unbekannter Fehler ist aufgetreten.');
      setIsProcessing(false);
    }
  };

  // Falls clientSecret noch nicht geladen wurde, zeige einen Ladeindikator an
  if (!clientSecret) {
    return <div>Lade Zahlungsinformationen...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <form onSubmit={handleSubmit}>
        <PaymentElement /> {/* UI für Karten, Apple Pay, Google Pay, PayPal */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit" disabled={isProcessing || !stripePromise}>
          {isProcessing ? 'Verarbeitung...' : 'Jetzt bezahlen'}
        </button>
      </form>
    </Elements>
  );
}
