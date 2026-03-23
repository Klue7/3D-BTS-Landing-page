import React, { useEffect, useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { useProductCatalog } from './ProductCatalogContext';

interface SectionCartCtaProps {
  sectionLabel: string;
  buttonLabel?: string;
  className?: string;
}

export function SectionCartCta({
  sectionLabel,
  buttonLabel = 'Add To Cart',
  className = '',
}: SectionCartCtaProps) {
  const { activeProduct, addActiveProductToCart } = useProductCatalog();
  const [didAdd, setDidAdd] = useState(false);

  useEffect(() => {
    if (!didAdd) return;

    const timeoutId = window.setTimeout(() => {
      setDidAdd(false);
    }, 1150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [didAdd]);

  useEffect(() => {
    setDidAdd(false);
  }, [activeProduct.id]);

  const handleAddToCart = () => {
    addActiveProductToCart(sectionLabel);
    setDidAdd(true);
  };

  return (
    <button
      onClick={handleAddToCart}
      aria-label={`Add ${activeProduct.productName} to cart from ${sectionLabel}`}
      className={`group relative inline-flex min-h-[3.55rem] items-center justify-center overflow-hidden rounded-full border border-[#22c55e]/28 bg-black/54 px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.24em] text-white shadow-[0_14px_36px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#22c55e]/65 hover:bg-[#22c55e]/10 hover:shadow-[0_0_30px_rgba(34,197,94,0.18)] active:scale-[0.98] ${className}`}
      type="button"
    >
      <span
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.18),transparent_70%)] transition-opacity duration-300 ${
          didAdd ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
      <span className="relative flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
            didAdd
              ? 'border-white/26 bg-white text-[#22c55e]'
              : 'border-white/10 bg-white/8 text-white group-hover:border-[#22c55e]/36 group-hover:bg-[#22c55e]/12'
          }`}
        >
          {didAdd ? <Check size={14} strokeWidth={2.8} /> : <ShoppingCart size={14} strokeWidth={2.2} />}
        </span>
        <span>{didAdd ? 'Added' : buttonLabel}</span>
      </span>
    </button>
  );
}
