import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart } from 'lucide-react';
import { gsap } from 'gsap';
import type { ProductVariant } from '../data/mockData';
import { useProductCatalog } from './ProductCatalogContext';
import { saveOrderDraft } from '../utils/orderDraft';
import { preloadImageAsset } from '../utils/textureGenerator';

interface SectionProductDetailPanelProps {
  product: ProductVariant;
  onBack: () => void;
  navigate: (path: string) => void;
  onStageReadyChange?: (ready: boolean) => void;
}

interface QuoteFormState {
  company: string;
  customerName: string;
  telephone: string;
  email: string;
  deliveryAddress: string;
  notes: string;
}

const INITIAL_FORM_STATE: QuoteFormState = {
  company: '',
  customerName: '',
  telephone: '',
  email: '',
  deliveryAddress: '',
  notes: '',
};

const QUOTE_STEPS = [
  { id: 'contact', label: 'Contact', number: '01' },
  { id: 'delivery', label: 'Delivery', number: '02' },
  { id: 'confirm', label: 'Confirm', number: '03' },
] as const;

type QuoteStepId = typeof QUOTE_STEPS[number]['id'];

function getSpecValue(product: ProductVariant, label: string) {
  return product.technical.specs.find((spec) => spec.label === label)?.value ?? '';
}

function getConciseDescription(description: string) {
  const firstSentence = description.match(/^[^.?!]+[.?!]/)?.[0]?.trim();
  return firstSentence && firstSentence.length > 0 ? firstSentence : description;
}

export function SectionProductDetailPanel({
  product,
  onBack,
  navigate,
  onStageReadyChange,
}: SectionProductDetailPanelProps) {
  const { addProductToCart } = useProductCatalog();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isQuoteFlowOpen, setIsQuoteFlowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<QuoteStepId>('contact');
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isActiveImageReady, setIsActiveImageReady] = useState(false);
  const detailStageRef = useRef<HTMLDivElement | null>(null);
  const quoteStageRef = useRef<HTMLDivElement | null>(null);
  const quoteContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setIsQuoteFlowOpen(false);
    setCurrentStep('contact');
    setFormState(INITIAL_FORM_STATE);
  }, [product.id]);

  useEffect(() => {
    const detailNode = detailStageRef.current;
    const quoteNode = quoteStageRef.current;

    if (!detailNode || !quoteNode) return;

    gsap.killTweensOf([detailNode, quoteNode]);

    if (isQuoteFlowOpen) {
      gsap.set(quoteNode, { pointerEvents: 'auto' });
      const timeline = gsap.timeline();

      timeline
        .to(detailNode, {
          autoAlpha: 0,
          y: -14,
          scale: 0.985,
          duration: 0.26,
          ease: 'power2.out',
        })
        .set(detailNode, { pointerEvents: 'none' })
        .fromTo(
          quoteNode,
          {
            autoAlpha: 0,
            y: 18,
            scale: 0.99,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.34,
            ease: 'power2.out',
          },
          '-=0.04'
        );

      return;
    }

    gsap.set(detailNode, { pointerEvents: 'auto' });
    const timeline = gsap.timeline();

    timeline
      .to(quoteNode, {
        autoAlpha: 0,
        y: 14,
        scale: 0.99,
        duration: 0.22,
        ease: 'power2.out',
      })
      .set(quoteNode, { pointerEvents: 'none' })
      .fromTo(
        detailNode,
        {
          autoAlpha: 0,
          y: -8,
          scale: 0.985,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.02'
      );
  }, [isQuoteFlowOpen]);

  useEffect(() => {
    if (!quoteContentRef.current || !isQuoteFlowOpen) return;

    gsap.killTweensOf(quoteContentRef.current);
    gsap.fromTo(
      quoteContentRef.current,
      {
        autoAlpha: 0,
        y: 10,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        ease: 'power2.out',
      }
    );
  }, [currentStep, isQuoteFlowOpen]);

  const galleryImages = useMemo(() => {
    const uniqueImages = Array.from(
      new Set(
        (product.finishAssets.galleryImages ?? [
          product.installationShowcase.secondaryImage,
          product.finishAssets.backdropImage,
          product.finishAssets.faceImage,
        ]).filter((value): value is string => Boolean(value))
      )
    );

    return uniqueImages;
  }, [
    product.finishAssets.backdropImage,
    product.finishAssets.faceImage,
    product.finishAssets.galleryImages,
    product.installationShowcase.secondaryImage,
  ]);

  const activeImage =
    galleryImages[Math.min(activeImageIndex, galleryImages.length - 1)] ?? product.finishAssets.faceImage;

  useEffect(() => {
    galleryImages.forEach((image) => {
      preloadImageAsset(image);
    });
  }, [galleryImages]);

  useEffect(() => {
    let cancelled = false;
    setIsActiveImageReady(false);

    preloadImageAsset(activeImage).finally(() => {
      if (!cancelled) {
        setIsActiveImageReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeImage]);

  useEffect(() => {
    onStageReadyChange?.(isActiveImageReady);
  }, [isActiveImageReady, onStageReadyChange]);

  const moduleLength = getSpecValue(product, 'LENGTH');
  const moduleHeight = getSpecValue(product, 'HEIGHT');
  const moduleThickness = getSpecValue(product, 'THICKNESS');

  const specRows = [
    { label: 'Module', value: `${moduleLength} × ${moduleHeight} × ${moduleThickness}` },
    { label: 'Coverage', value: `${product.technical.microTextureValue} tiles / sqm` },
    { label: 'Selection', value: product.technical.coatingDisplay },
    { label: 'Box Detail', value: product.pricing.detail },
  ];
  const conciseDescription = useMemo(() => getConciseDescription(product.heroDescription), [product.heroDescription]);

  const unitPriceValue = useMemo(() => {
    const normalized = product.pricing.amount.replace(/[^\d.,]/g, '').replace(/,/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }, [product.pricing.amount]);

  const totalPrice = useMemo(() => {
    if (unitPriceValue === null) return null;

    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(unitPriceValue * quantity);
  }, [quantity, unitPriceValue]);

  const isContactReady = Boolean(
    formState.customerName.trim() &&
      formState.telephone.trim() &&
      formState.email.trim()
  );
  const isDeliveryReady = Boolean(formState.deliveryAddress.trim());
  const currentStepIndex = QUOTE_STEPS.findIndex((step) => step.id === currentStep);

  const canOpenStep = (stepId: QuoteStepId) => {
    switch (stepId) {
      case 'contact':
        return true;
      case 'delivery':
        return isContactReady;
      case 'confirm':
        return isContactReady && isDeliveryReady;
      default:
        return false;
    }
  };

  const handleStartQuoteFlow = () => {
    addProductToCart(product.id, quantity, 'Selection Board', { openCart: false });
    setCurrentStep('contact');
    setIsQuoteFlowOpen(true);
  };

  const handleContinueToPortal = () => {
    saveOrderDraft({
      productId: product.id,
      productName: product.productName,
      quantity,
      company: formState.company,
      customerName: formState.customerName,
      telephone: formState.telephone,
      email: formState.email,
      deliveryAddress: formState.deliveryAddress,
      notes: formState.notes,
      sourceLabel: 'Selection Board',
      submittedAt: Date.now(),
    });
    navigate('/order-portal');
  };

  const renderQuoteStep = () => {
    if (currentStep === 'contact') {
      return (
        <div className="space-y-5">
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[#22c55e]">Step 1 / Contact</p>
            <h4 className="mt-2 text-[1.28rem] font-semibold tracking-[-0.03em] text-white">
              Add the project contact.
            </h4>
            <p className="mt-2 max-w-[28rem] text-[0.8rem] leading-5 text-white/50">
              Keep it light. We only need enough to open the draft and hand it into the BTS order portal.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Company</span>
              <input
                type="text"
                value={formState.company}
                onChange={(event) => setFormState((current) => ({ ...current, company: event.target.value }))}
                className="mt-2.5 w-full border-b border-white/12 bg-transparent pb-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/18 focus:border-[#22c55e]/45"
                placeholder="Company"
              />
            </label>
            <label className="block">
              <span className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Name</span>
              <input
                type="text"
                value={formState.customerName}
                onChange={(event) => setFormState((current) => ({ ...current, customerName: event.target.value }))}
                className="mt-2.5 w-full border-b border-white/12 bg-transparent pb-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/18 focus:border-[#22c55e]/45"
                placeholder="Full name"
              />
            </label>
            <label className="block">
              <span className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Telephone</span>
              <input
                type="tel"
                value={formState.telephone}
                onChange={(event) => setFormState((current) => ({ ...current, telephone: event.target.value }))}
                className="mt-2.5 w-full border-b border-white/12 bg-transparent pb-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/18 focus:border-[#22c55e]/45"
                placeholder="Telephone"
              />
            </label>
            <label className="block">
              <span className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Email</span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                className="mt-2.5 w-full border-b border-white/12 bg-transparent pb-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/18 focus:border-[#22c55e]/45"
                placeholder="Email"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <button
              type="button"
              onClick={() => setIsQuoteFlowOpen(false)}
              className="inline-flex min-h-[2.9rem] items-center justify-center rounded-full border border-white/12 bg-white/[0.02] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/68 transition-colors hover:border-white/24 hover:text-white"
            >
              Back to product
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('delivery')}
              disabled={!isContactReady}
              className="inline-flex min-h-[2.9rem] items-center justify-center gap-3 rounded-full bg-white px-6 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
            >
              Continue
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === 'delivery') {
      return (
        <div className="space-y-5">
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[#22c55e]">Step 2 / Delivery</p>
            <h4 className="mt-2 text-[1.28rem] font-semibold tracking-[-0.03em] text-white">
              Capture the site details.
            </h4>
            <p className="mt-2 max-w-[28rem] text-[0.8rem] leading-5 text-white/50">
              Add the address and any access notes that should travel with the order request.
            </p>
          </div>

          <div className="grid gap-3">
            <label className="block">
              <span className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Delivery address</span>
              <input
                type="text"
                value={formState.deliveryAddress}
                onChange={(event) => setFormState((current) => ({ ...current, deliveryAddress: event.target.value }))}
                className="mt-2.5 w-full border-b border-white/12 bg-transparent pb-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/18 focus:border-[#22c55e]/45"
                placeholder="Address, suburb, postal code"
              />
            </label>
            <label className="block">
              <span className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Special notes</span>
              <textarea
                value={formState.notes}
                onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
                className="mt-2.5 min-h-[4.4rem] w-full resize-none border-b border-white/12 bg-transparent pb-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/18 focus:border-[#22c55e]/45"
                placeholder="Project notes, access notes, preferred timing"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <button
              type="button"
              onClick={() => setCurrentStep('contact')}
              className="inline-flex min-h-[2.9rem] items-center justify-center rounded-full border border-white/12 bg-white/[0.02] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/68 transition-colors hover:border-white/24 hover:text-white"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('confirm')}
              disabled={!isDeliveryReady}
              className="inline-flex min-h-[2.9rem] items-center justify-center gap-3 rounded-full bg-white px-6 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-black transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
            >
              Review draft
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div>
          <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[#22c55e]">Step 3 / Confirm</p>
          <h4 className="mt-2 text-[1.28rem] font-semibold tracking-[-0.03em] text-white">
            Send the draft to the portal.
          </h4>
          <p className="mt-2 max-w-[28rem] text-[0.8rem] leading-5 text-white/50">
            This handoff carries the selected finish, quantity, contact, and delivery notes into the official BTS order flow.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[0.56rem] uppercase tracking-[0.24em] text-white/34">Finish</p>
            <p className="mt-2 text-base font-semibold text-white">{product.productName}</p>
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[0.56rem] uppercase tracking-[0.24em] text-white/34">Quantity</p>
            <p className="mt-2 text-base font-semibold text-white">{String(quantity).padStart(2, '0')}</p>
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[0.56rem] uppercase tracking-[0.24em] text-white/34">Contact</p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              {[formState.customerName, formState.telephone, formState.email].filter(Boolean).join(' / ') || 'Pending'}
            </p>
          </div>
          <div className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-[0.56rem] uppercase tracking-[0.24em] text-white/34">Delivery</p>
            <p className="mt-2 text-sm leading-6 text-white/72">{formState.deliveryAddress || 'Pending'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <button
            type="button"
            onClick={() => setCurrentStep('delivery')}
            className="inline-flex min-h-[2.9rem] items-center justify-center rounded-full border border-white/12 bg-white/[0.02] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/68 transition-colors hover:border-white/24 hover:text-white"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinueToPortal}
            className="inline-flex min-h-[2.95rem] items-center justify-center rounded-full bg-white px-6 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-black transition-transform duration-300 hover:scale-[1.01]"
          >
            Continue To Order Portal
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pointer-events-auto mx-auto w-full max-w-[60rem] rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,9,9,0.975),rgba(4,4,4,0.995))] p-[0.92rem] shadow-[0_24px_54px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-[0.95rem]">
      <div className="relative min-h-[27.6rem]">
        <div
          ref={detailStageRef}
          className="absolute inset-0 grid items-start gap-3 lg:grid-cols-[0.88fr_0.84fr]"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white/70 transition-colors hover:border-[#22c55e]/36 hover:text-[#22c55e]"
              >
                <ArrowLeft size={14} />
                Back to range
              </button>

              <span className="rounded-full border border-[#22c55e]/24 bg-[#22c55e]/[0.06] px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.26em] text-[#22c55e]">
                Live finish
              </span>
            </div>

            <div className="grid gap-2.5 lg:grid-cols-[3.2rem_1fr]">
              <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:overflow-visible">
                {galleryImages.map((image, index) => {
                  const isActive = index === activeImageIndex;

                  return (
                    <button
                      key={`${product.id}-gallery-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`group relative h-[3.2rem] w-[3.2rem] shrink-0 overflow-hidden rounded-[0.8rem] border transition-all duration-300 ${
                        isActive
                          ? 'border-[#22c55e]/45 bg-[#22c55e]/[0.05]'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.productName} gallery view ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <span className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.24))] ${isActive ? 'opacity-0' : ''}`} />
                    </button>
                  );
                })}
              </div>

              <div className="order-1 overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#090909] lg:order-2">
                <div className="relative aspect-[1.3]">
                  <div
                    className={`pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0.01)_28%,rgba(0,0,0,0.18)_80%),linear-gradient(180deg,rgba(14,14,14,0.92),rgba(6,6,6,0.98))] transition-opacity duration-300 ${
                      isActiveImageReady ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <img
                    src={activeImage}
                    alt={`${product.productName} installation preview`}
                    className={`h-full w-full object-cover transition-[opacity,transform] duration-300 ${
                      isActiveImageReady ? 'scale-100 opacity-100' : 'scale-[1.015] opacity-0'
                    }`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.84))] p-2.25">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.3em] text-white/45">
                          Brick Tile Shop / Cladding
                        </p>
                        <p className="mt-1 text-[0.82rem] font-semibold text-white md:text-[0.9rem]">{product.productName}</p>
                      </div>
                      <div className="rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-[0.54rem] uppercase tracking-[0.24em] text-white/62">
                        {String(activeImageIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
              {specRows.map((spec) => (
                <div key={spec.label} className="border-b border-white/8 pb-1.25">
                  <p className="text-[0.56rem] uppercase tracking-[0.24em] text-white/34">{spec.label}</p>
                  <p className="mt-1 text-[0.71rem] font-medium leading-5 text-white/68">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.02] p-[0.98rem]">
              <p className="text-[0.62rem] uppercase tracking-[0.26em] text-white/38">
                Brick Tile Shop / Cladding Tiles / {product.productName}
              </p>
              <h3 className="mt-2 text-[clamp(1.32rem,2.2vw,1.88rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-white">
                {product.productName}
              </h3>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-[clamp(1.36rem,2.2vw,1.92rem)] font-semibold tracking-[-0.05em] text-[#22c55e]">
                  {product.pricing.amount}
                </span>
                <span className="pb-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">incl VAT</span>
              </div>
              <p className="mt-2 max-w-[21rem] text-[0.69rem] leading-5 text-white/34">
                {conciseDescription}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-white/58">
                  {product.category}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-white/58">
                  {product.pricing.detail}
                </span>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-white/10 bg-[#060606]/88 p-[0.98rem]">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[#22c55e]">Quick order / quote</p>
                  <h4 className="mt-1.5 text-[0.94rem] font-semibold tracking-[-0.03em] text-white">
                    Lock quantity, then quote.
                  </h4>
                  <p className="mt-1 max-w-[13.5rem] text-[0.64rem] leading-5 text-white/26">
                    Add the finish, then open the guided draft.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/68 transition-colors hover:border-[#22c55e]/32 hover:text-[#22c55e]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="min-w-[3.75rem] text-center">
                    <p className="text-[0.56rem] uppercase tracking-[0.28em] text-white/32">Qty</p>
                    <p className="mt-1 text-base font-semibold text-white">{String(quantity).padStart(2, '0')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/68 transition-colors hover:border-[#22c55e]/32 hover:text-[#22c55e]"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-white/8 py-2">
                <div>
                  <p className="text-[0.56rem] uppercase tracking-[0.24em] text-white/34">Unit price</p>
                  <p className="mt-1 text-[0.86rem] font-semibold text-white">{product.pricing.amount}</p>
                </div>
                <div className="hidden h-8 w-px bg-white/8 sm:block" />
                <div>
                  <p className="text-[0.56rem] uppercase tracking-[0.24em] text-white/34">Estimated total</p>
                  <p className="mt-1 text-[0.86rem] font-semibold text-white">{totalPrice ?? product.pricing.amount}</p>
                </div>
              </div>

              <div className="mt-2.5 flex flex-col gap-3 lg:flex-row">
                <button
                  type="button"
                  onClick={handleStartQuoteFlow}
                  className="inline-flex min-h-[2.55rem] w-full items-center justify-center gap-3 rounded-full border border-[#22c55e]/28 bg-black/40 px-5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-[#22c55e]/58 hover:bg-[#22c55e]/10"
                >
                  <ShoppingCart size={15} strokeWidth={2.1} />
                  <span>Add To Cart & Start Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={quoteStageRef}
          className="pointer-events-none absolute inset-0 opacity-0"
        >
          <div className="grid h-full gap-3.5 lg:grid-cols-[10.8rem_1fr]">
            <div className="rounded-[1.2rem] border border-white/10 bg-[#060606]/88 p-3.5">
              <button
                type="button"
                onClick={() => setIsQuoteFlowOpen(false)}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-white/70 transition-colors hover:border-[#22c55e]/36 hover:text-[#22c55e]"
              >
                <ArrowLeft size={14} />
                Back to product
              </button>

              <div className="mt-4 rounded-[1rem] border border-[#22c55e]/18 bg-[#22c55e]/[0.05] px-3.5 py-3">
                <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/36">Active draft</p>
                <p className="mt-2 text-[1rem] font-semibold text-white">{product.productName}</p>
                <p className="mt-2.5 text-[0.76rem] leading-5 text-white/62">
                  {String(quantity).padStart(2, '0')} units / {product.pricing.detail}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {QUOTE_STEPS.map((step, stepIndex) => {
                  const isActive = currentStep === step.id;
                  const isComplete = stepIndex < currentStepIndex;
                  const isEnabled = canOpenStep(step.id);

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        if (isEnabled) setCurrentStep(step.id);
                      }}
                      disabled={!isEnabled}
                      className={`flex w-full items-center gap-3 rounded-[0.95rem] border px-3 py-2.5 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-[#22c55e]/35 bg-[#22c55e]/[0.07]'
                          : isComplete
                            ? 'border-white/10 bg-white/[0.03] hover:border-white/18'
                            : 'border-white/8 bg-transparent opacity-55'
                      } ${!isEnabled ? 'cursor-not-allowed' : ''}`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${
                        isActive
                          ? 'border-[#22c55e]/55 text-[#22c55e]'
                          : isComplete
                            ? 'border-white/18 text-white/72'
                            : 'border-white/10 text-white/34'
                      }`}>
                        {step.number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.58rem] uppercase tracking-[0.24em] text-white/34">Step</p>
                        <p className="mt-1 text-[0.84rem] font-semibold text-white">{step.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-white/10 bg-[#060606]/88 p-4">
              <div
                key={currentStep}
                ref={quoteContentRef}
                className="min-h-[21rem]"
              >
                {renderQuoteStep()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
