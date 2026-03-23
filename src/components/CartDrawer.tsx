import React, { useEffect, useRef } from 'react';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useProductCatalog } from './ProductCatalogContext';

function formatSpecSummary(values: string[]) {
  return values.join(' • ');
}

export function CartDrawer() {
  const {
    cartItems,
    cartCount,
    isCartOpen,
    closeCart,
    removeCartItem,
    updateCartItemQuantity,
  } = useProductCatalog();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isCartOpen) return;

    const previousOverflow = document.body.style.overflow;
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) {
        return;
      }

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (!focusableElements.length) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (event.shiftKey) {
        if (!activeElement || activeElement === firstElement || !drawerRef.current.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (!activeElement || activeElement === lastElement || !drawerRef.current.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [closeCart, isCartOpen]);

  return (
    <div
      className={`fixed inset-0 z-[120] transition-all duration-300 ${
        isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        onClick={closeCart}
        className={`absolute inset-0 bg-black/68 backdrop-blur-[4px] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close cart"
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cart drawer"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-[min(31rem,100vw)] flex-col border-l border-white/10 bg-[#070707] shadow-[-28px_0_80px_rgba(0,0,0,0.52)] transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between border-b border-white/8 px-6 pb-5 pt-7 md:px-8">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#22c55e]">Selected Finishes</p>
            <h2 className="mt-2 font-['Anton'] text-[2.2rem] uppercase leading-[0.9] tracking-[-0.05em] text-white">
              Your Cart ({cartCount})
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            className="rounded-full border border-white/10 p-2 text-white/66 transition-colors hover:border-[#22c55e]/45 hover:text-white"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-white/10 bg-white/[0.02] px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72">
                <ShoppingBag size={24} />
              </div>
              <p className="mt-6 font-['Anton'] text-[2rem] uppercase tracking-[-0.05em] text-white">Cart Empty</p>
              <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/48">
                Add a finish from the hero or story sections to build your current selection set.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(({ product, quantity, sourceLabel }) => (
                <article
                  key={product.id}
                  className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] border border-white/8 bg-black/50">
                      {product.finishAssets.faceImage ? (
                        <img
                          src={product.finishAssets.faceImage}
                          alt={`${product.productName} sample preview`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{
                            background: `linear-gradient(135deg, ${product.scenePalette.highlight}, ${product.scenePalette.mid} 56%, ${product.scenePalette.shadow})`,
                          }}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[0.74rem] uppercase tracking-[0.24em] text-white/42">{product.category}</p>
                          <h3 className="mt-1 truncate text-[1.35rem] font-semibold tracking-tight text-white">
                            {product.productName}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCartItem(product.id)}
                          className="rounded-full border border-white/10 p-1.5 text-white/42 transition-colors hover:border-[#22c55e]/45 hover:text-white"
                          aria-label={`Remove ${product.productName} from cart`}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.24em] text-[#22c55e]">
                        {formatSpecSummary(product.technical.specs.slice(0, 3).map((spec) => spec.value))}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/44">
                        Added from {sourceLabel.toLowerCase()}.
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-black/40 p-1">
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(product.id, quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-white/62 transition-colors hover:bg-white/8 hover:text-white"
                            aria-label={`Decrease ${product.productName} quantity`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-9 text-center text-sm font-semibold text-white">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartItemQuantity(product.id, quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-white/62 transition-colors hover:bg-white/8 hover:text-white"
                            aria-label={`Increase ${product.productName} quantity`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="text-[0.72rem] uppercase tracking-[0.26em] text-white/54">
                          Qty {String(quantity).padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/8 px-6 pb-7 pt-5 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.74rem] uppercase tracking-[0.3em] text-white/42">Subtotal</p>
              <p className="mt-2 font-['Anton'] text-[2.1rem] uppercase leading-none tracking-[-0.05em] text-white">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
              </p>
            </div>
            <p className="max-w-[10rem] text-right text-xs uppercase tracking-[0.22em] text-white/42">
              Pricing confirmed during checkout request
            </p>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-[1.25rem] bg-white px-6 py-4 text-[0.9rem] font-bold uppercase tracking-[0.28em] text-black transition-colors hover:bg-[#22c55e] hover:text-white"
          >
            Checkout
          </button>
          <p className="mt-4 text-center text-[0.72rem] uppercase tracking-[0.3em] text-white/32">
            Finish-led support available worldwide
          </p>
        </div>
      </aside>
    </div>
  );
}
