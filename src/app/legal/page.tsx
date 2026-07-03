import { restrictedCategories } from "@/data/products";

export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl rounded-lg border border-zinc-200 bg-white p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        Legal
      </p>
      <h1 className="mt-2 text-3xl font-black text-emerald-950">
        PAANX Beta policies
      </h1>
      <div className="mt-6 space-y-6 text-sm leading-7 text-zinc-650">
        <section>
          <h2 className="text-lg font-bold text-zinc-950">MVP status</h2>
          <p>
            PAANX Beta v0.1 is a customer-facing prototype. Product data is local
            sample data, ordering is WhatsApp-assisted, and no payment is
            collected inside the app.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-zinc-950">
            Restricted products
          </h2>
          <p>
            The following categories are marked 18+:{" "}
            {restrictedCategories.join(", ")}. Customers must be legally eligible
            and may need to show valid ID at delivery.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-zinc-950">No vapes</h2>
          <p>
            PAANX Beta does not list vapes, e-cigarettes, or related vaping
            products.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-zinc-950">Privacy</h2>
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
