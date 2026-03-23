import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ClipboardList, ShoppingBag } from 'lucide-react';
import { useProductCatalog } from './ProductCatalogContext';
import { clearOrderDraft, readOrderDraft, type OrderDraft } from '../utils/orderDraft';

interface OrderPortalPageProps {
  navigate: (path: string) => void;
}

export function OrderPortalPage({ navigate }: OrderPortalPageProps) {
  const { activeProduct, openCart } = useProductCatalog();
  const [draft, setDraft] = useState<OrderDraft | null>(null);

  useEffect(() => {
    setDraft(readOrderDraft());
  }, []);

  const reference = useMemo(() => {
    if (!draft) return 'BTS-DRAFT-0000';
    return `BTS-DRAFT-${String(draft.submittedAt).slice(-6)}`;
  }, [draft]);

  return (
    <main className="relative z-10 min-h-screen px-5 pb-12 pt-28 md:px-8 md:pt-32">
      <div className="mx-auto flex w-full max-w-[78rem] flex-col gap-7">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={() => navigate('/#entry-layout')}
            className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/72 transition-colors hover:border-[#22c55e]/48 hover:text-[#22c55e]"
          >
            <ArrowLeft size={15} />
            Back To Selection
          </button>

          <div className="rounded-full border border-[#22c55e]/24 bg-[#22c55e]/[0.06] px-4 py-3 text-[0.68rem] uppercase tracking-[0.28em] text-[#22c55e]">
            Official order portal
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-[#070707]/92 p-7 shadow-[0_28px_70px_rgba(0,0,0,0.34)] md:p-9">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-white/62">
              Quote draft reference
            </span>
            <h1 className="mt-6 font-['Anton'] text-[clamp(2.6rem,5vw,4.4rem)] uppercase leading-[0.9] tracking-[-0.05em] text-white">
              {reference}
            </h1>
            <p className="mt-4 max-w-[28rem] text-[0.98rem] leading-7 text-white/58">
              The finish and customer details from section 2 are parked here so the BTS order flow can take over cleanly.
            </p>

            <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-white/10">
              <img
                src={activeProduct.finishAssets.galleryImages?.[0] ?? activeProduct.finishAssets.backdropImage}
                alt={`${activeProduct.productName} product preview`}
                className="aspect-[1.08] w-full object-cover"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/34">Selected finish</p>
                <p className="mt-2 text-lg font-semibold text-white">{draft?.productName ?? activeProduct.productName}</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.02] px-4 py-4">
                <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/34">Quantity requested</p>
                <p className="mt-2 text-lg font-semibold text-white">{String(draft?.quantity ?? 1).padStart(2, '0')}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[#060606]/92 p-7 shadow-[0_28px_70px_rgba(0,0,0,0.32)] md:p-9">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#22c55e]">
                <ClipboardList size={21} />
              </span>
              <div>
                <p className="text-[0.66rem] uppercase tracking-[0.28em] text-white/42">Draft summary</p>
                <p className="mt-2 text-lg font-semibold text-white">Customer and delivery details</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="border-b border-white/10 pb-4">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Company</p>
                <p className="mt-2 text-sm text-white/72">{draft?.company || 'Pending'}</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Name</p>
                <p className="mt-2 text-sm text-white/72">{draft?.customerName || 'Pending'}</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Telephone</p>
                <p className="mt-2 text-sm text-white/72">{draft?.telephone || 'Pending'}</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Email</p>
                <p className="mt-2 text-sm text-white/72">{draft?.email || 'Pending'}</p>
              </div>
              <div className="border-b border-white/10 pb-4 md:col-span-2">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Delivery address</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{draft?.deliveryAddress || 'Pending'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Special notes</p>
                <p className="mt-2 text-sm leading-6 text-white/58">{draft?.notes || 'No special notes captured yet.'}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                onClick={() => {
                  openCart();
                  navigate('/#entry-layout');
                }}
                className="inline-flex min-h-[3.45rem] items-center justify-center gap-3 rounded-full border border-[#22c55e]/28 bg-black/40 px-6 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white transition-colors hover:border-[#22c55e]/58 hover:bg-[#22c55e]/10"
              >
                <ShoppingBag size={15} />
                Review Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  clearOrderDraft();
                  navigate('/#entry-layout');
                }}
                className="inline-flex min-h-[3.45rem] items-center justify-center rounded-full bg-white px-6 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-black transition-transform duration-300 hover:scale-[1.01]"
              >
                Continue Browsing
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
