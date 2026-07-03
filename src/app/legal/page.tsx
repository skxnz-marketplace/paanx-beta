import { restrictedCategories } from "@/data/categories";

export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl rounded-[4px] border border-gold-200/10 glass p-6 md:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500">
        Legal
      </p>
      <h1 className="font-display mt-1.5 text-4xl font-black tracking-tight text-gold-100">
        PAANX Beta policies
      </h1>
      <div className="mt-6 space-y-6 text-sm leading-7 text-gold-200/75">
        <section>
          <h2 className="text-lg font-black tracking-tight text-gold-100">MVP status</h2>
          <p>
            PAANX Beta v0.1 is a customer-facing prototype. Product data is local
            sample data, ordering is WhatsApp-assisted, and no payment is
            collected inside the app.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-black tracking-tight text-gold-100">
            Restricted products
          </h2>
          <p>
            The following categories are marked 18+:{" "}
            {restrictedCategories.join(", ")}. Customers must be legally eligible
            and may need to show valid ID at delivery.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-black tracking-tight text-gold-100">No vapes</h2>
          <p>
            PAANX Beta does not list vapes, e-cigarettes, or related vaping
            products.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-black tracking-tight text-gold-100">Privacy</h2>
          <p>
            Cart, age confirmation, and order history are stored only in browser
            localStorage for this MVP. There is no database, login, admin panel,
            seller app, rider app, backend, or payment gateway.
          </p>
        </section>
      </div>
    </article>
  );
}
