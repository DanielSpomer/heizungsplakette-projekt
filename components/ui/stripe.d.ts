declare module '@/components/stripe' {
    export function Stripe({ children }: { children: React.ReactNode }): JSX.Element;
    export function StripeCheckout(): JSX.Element;
  }