export const metadata = { title: "Privacy Policy — Breaking Bread" };

export default function PrivacyPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3a1c0e] mb-2">
        Privacy Policy
      </h1>
      <p className="text-[#8a5733] text-sm mb-8">Last updated: June 2026</p>

      <div className="space-y-6 text-[#3a1c0e] leading-relaxed">
        <div>
          <h2 className="font-bold text-lg mb-1">What we collect</h2>
          <p>
            When you place an order or contact us, we collect the information you
            provide: your name, email, phone number, pickup details, and any
            notes. We do not collect anything you don&apos;t give us.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">How we use it</h2>
          <p>
            We use your information only to prepare and coordinate your order, to
            send you order confirmations and pickup updates, and to respond to
            your messages. We never sell or rent your information to anyone.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">Payments</h2>
          <p>
            Card payments are handled securely by Stripe. We never see or store
            your full card number — that information goes directly to Stripe.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">Service providers</h2>
          <p>
            We use trusted services to run the bakery: Stripe (payments), Supabase
            (order storage), and Resend (email). Your information is shared with
            these providers only as needed to fulfill your order.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">Contact</h2>
          <p>
            Questions about your privacy or want your information removed? Email{" "}
            <a href="mailto:orders@breaking-bread.net" className="underline text-[#a3471f]">
              orders@breaking-bread.net
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
