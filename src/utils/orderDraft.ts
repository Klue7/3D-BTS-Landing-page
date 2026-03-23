export interface OrderDraft {
  productId: string;
  productName: string;
  quantity: number;
  company: string;
  customerName: string;
  telephone: string;
  email: string;
  deliveryAddress: string;
  notes: string;
  sourceLabel: string;
  submittedAt: number;
}

const ORDER_DRAFT_STORAGE_KEY = 'bts-order-draft';

export function saveOrderDraft(draft: OrderDraft) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(ORDER_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function readOrderDraft(): OrderDraft | null {
  if (typeof window === 'undefined') return null;

  const stored = window.sessionStorage.getItem(ORDER_DRAFT_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as OrderDraft;
  } catch {
    return null;
  }
}

export function clearOrderDraft() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
}
