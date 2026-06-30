export const metadata = { title: "Terms of Service — Breaking Bread" };

export default function TermsPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3a1c0e] mb-2">
        Terms of Service
      </h1>
      <p className="text-[#8a5733] text-sm mb-8">Last updated: June 2026</p>

      <div className="space-y-6 text-[#3a1c0e] leading-relaxed">
        <div>
          <h2 className="font-bold text-lg mb-1">Orders &amp; pickup</h2>
          <p>
            Breaking Bread sells handcrafted sourdough by pre-order for local
            pickup. When you place an order, you choose a pickup location, date,
            and time window. We bake to order, so orders require at least two
            days&apos; lead time. Please pick up your order during your scheduled
            window.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">Payment</h2>
          <p>
            Card payments are processed securely by Stripe. We also accept Venmo,
            cash, or check, arranged at pickup. Prices are listed on the order
            page and are subject to change.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">Cancellations &amp; refunds</h2>
          <p>
            Because every loaf is made fresh to order, please contact us as soon
            as possible if you need to cancel or change an order. We&apos;ll do
            our best to accommodate you and will handle refunds on a
            case-by-case basis.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">Allergens</h2>
          <p>
            Our breads are made in a home kitchen that handles wheat, dairy,
            and other allergens. We cannot guarantee any product is free from
            cross-contact. Please reach out with any dietary concerns before
            ordering.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg mb-1">Contact</h2>
          <p>
            Questions about your order or these terms? Email{" "}
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
