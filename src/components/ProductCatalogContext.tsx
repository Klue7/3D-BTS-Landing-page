import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { defaultProductId, productCatalog, type ProductVariant } from '../data/mockData';

interface CartEntry {
  productId: string;
  quantity: number;
  sourceLabel: string;
}

interface ProductCatalogState {
  products: ProductVariant[];
  activeProduct: ProductVariant;
  activeProductIndex: number;
  cartItems: Array<{
    product: ProductVariant;
    quantity: number;
    sourceLabel: string;
  }>;
  cartCount: number;
  isCartOpen: boolean;
  lastCartEvent: {
    id: number;
    title: string;
    message: string;
  } | null;
  setActiveProductId: (id: string) => void;
  goToNextProduct: () => void;
  goToPreviousProduct: () => void;
  addProductToCart: (
    productId: string,
    quantity: number,
    sourceLabel: string,
    options?: {
      openCart?: boolean;
    }
  ) => void;
  addActiveProductToCart: (sourceLabel: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearLastCartEvent: () => void;
}

const ProductCatalogContext = createContext<ProductCatalogState | undefined>(undefined);
const PRODUCT_PARAM = 'finish';

function getProductIndex(productId: string) {
  const foundIndex = productCatalog.findIndex((product) => product.id === productId);
  return foundIndex >= 0 ? foundIndex : 0;
}

function getProductIdFromLocation() {
  if (typeof window === 'undefined') {
    return defaultProductId;
  }

  const currentUrl = new URL(window.location.href);
  const requestedId = currentUrl.searchParams.get(PRODUCT_PARAM) ?? defaultProductId;

  return productCatalog[getProductIndex(requestedId)].id;
}

function syncProductIdToLocation(productId: string, historyMode: 'push' | 'replace') {
  if (typeof window === 'undefined') {
    return;
  }

  const currentUrl = new URL(window.location.href);

  if (productId === defaultProductId) {
    currentUrl.searchParams.delete(PRODUCT_PARAM);
  } else {
    currentUrl.searchParams.set(PRODUCT_PARAM, productId);
  }

  const destination = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (destination === current) {
    return;
  }

  const historyMethod = historyMode === 'replace' ? window.history.replaceState : window.history.pushState;
  historyMethod.call(window.history, {}, '', destination);
}

export function ProductCatalogProvider({ children }: { children: React.ReactNode }) {
  const [activeProductId, setActiveProductIdState] = useState(getProductIdFromLocation);
  const [cartEntries, setCartEntries] = useState<CartEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastCartEvent, setLastCartEvent] = useState<ProductCatalogState['lastCartEvent']>(null);

  const activeCatalogProductIndex = useMemo(() => {
    return getProductIndex(activeProductId);
  }, [activeProductId]);

  const activeProduct = productCatalog[activeCatalogProductIndex];

  const products = useMemo(() => {
    return productCatalog.filter((product) => product.objectMode === activeProduct.objectMode);
  }, [activeProduct.objectMode]);

  const activeProductIndex = useMemo(() => {
    const foundIndex = products.findIndex((product) => product.id === activeProduct.id);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [activeProduct.id, products]);

  const cartItems = useMemo(() => {
    return cartEntries.map((entry) => ({
      product: productCatalog[getProductIndex(entry.productId)],
      quantity: entry.quantity,
      sourceLabel: entry.sourceLabel,
    }));
  }, [cartEntries]);

  const cartCount = useMemo(() => {
    return cartEntries.reduce((total, entry) => total + entry.quantity, 0);
  }, [cartEntries]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveProductIdState(getProductIdFromLocation());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const updateActiveProduct = useCallback((productId: string, historyMode: 'push' | 'replace') => {
    const nextProductId = productCatalog[getProductIndex(productId)].id;

    setActiveProductIdState((currentProductId) => (currentProductId === nextProductId ? currentProductId : nextProductId));
    syncProductIdToLocation(nextProductId, historyMode);
  }, []);

  const setActiveProductId = useCallback((productId: string) => {
    updateActiveProduct(productId, 'push');
  }, [updateActiveProduct]);

  const goToNextProduct = useCallback(() => {
    if (products.length === 0) return;
    const nextIndex = (activeProductIndex + 1) % products.length;
    updateActiveProduct(products[nextIndex].id, 'push');
  }, [activeProductIndex, products, updateActiveProduct]);

  const goToPreviousProduct = useCallback(() => {
    if (products.length === 0) return;
    const nextIndex = (activeProductIndex - 1 + products.length) % products.length;
    updateActiveProduct(products[nextIndex].id, 'push');
  }, [activeProductIndex, products, updateActiveProduct]);

  const addProductToCart = useCallback((
    productId: string,
    quantity: number,
    sourceLabel: string,
    options?: {
      openCart?: boolean;
    }
  ) => {
    const targetProduct = productCatalog[getProductIndex(productId)];
    const normalizedQuantity = Math.max(1, Math.floor(quantity));

    setCartEntries((previousEntries) => {
      const nextEntries = [...previousEntries];
      const existingEntry = nextEntries.find((entry) => entry.productId === targetProduct.id);

      if (existingEntry) {
        existingEntry.quantity += normalizedQuantity;
        existingEntry.sourceLabel = sourceLabel;
      } else {
        nextEntries.push({
          productId: targetProduct.id,
          quantity: normalizedQuantity,
          sourceLabel,
        });
      }

      const nextCount = nextEntries.reduce((total, entry) => total + entry.quantity, 0);

      setLastCartEvent({
        id: Date.now(),
        title: `${targetProduct.productName} added to cart`,
        message: `${nextCount} item${nextCount === 1 ? '' : 's'} ready from ${sourceLabel.toLowerCase()}.`,
      });

      return nextEntries;
    });
    if (options?.openCart !== false) {
      setIsCartOpen(true);
    }
  }, []);

  const addActiveProductToCart = useCallback((sourceLabel: string) => {
    addProductToCart(activeProduct.id, 1, sourceLabel);
  }, [activeProduct.id, addProductToCart]);

  const updateCartItemQuantity = useCallback((productId: string, quantity: number) => {
    setCartEntries((previousEntries) => {
      if (quantity <= 0) {
        return previousEntries.filter((entry) => entry.productId !== productId);
      }

      return previousEntries.map((entry) => (
        entry.productId === productId
          ? { ...entry, quantity }
          : entry
      ));
    });
  }, []);

  const removeCartItem = useCallback((productId: string) => {
    setCartEntries((previousEntries) => previousEntries.filter((entry) => entry.productId !== productId));
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((current) => !current);
  }, []);

  const clearLastCartEvent = useCallback(() => {
    setLastCartEvent(null);
  }, []);

  return (
    <ProductCatalogContext.Provider
      value={{
        products,
        activeProduct,
        activeProductIndex,
        cartItems,
        cartCount,
        isCartOpen,
        lastCartEvent,
        setActiveProductId,
        goToNextProduct,
        goToPreviousProduct,
        addProductToCart,
        addActiveProductToCart,
        updateCartItemQuantity,
        removeCartItem,
        openCart,
        closeCart,
        toggleCart,
        clearLastCartEvent,
      }}
    >
      {children}
    </ProductCatalogContext.Provider>
  );
}

export function useProductCatalog() {
  const context = useContext(ProductCatalogContext);

  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductCatalogProvider');
  }

  return context;
}
