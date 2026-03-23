/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { MainLayout } from './components/MainLayout';
import { VisualLabProvider } from './components/VisualLabContext';
import { ProductCatalogProvider } from './components/ProductCatalogContext';

function normalizePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
}

export default function App() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  const scrollToHash = useCallback((hash: string) => {
    if (!hash) return;

    const targetId = hash.replace(/^#/, '');

    const attemptScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return false;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    };

    if (!attemptScroll()) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          attemptScroll();
        });
      });
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname));
      if (window.location.hash) {
        scrollToHash(window.location.hash);
      }
    };

    window.addEventListener('popstate', handlePopState);

    if (window.location.hash) {
      scrollToHash(window.location.hash);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [scrollToHash]);

  const navigate = useCallback((next: string) => {
    const currentUrl = new URL(window.location.href);
    const nextUrl = new URL(next, currentUrl);

    if (!next.includes('?')) {
      nextUrl.search = currentUrl.search;
    }

    const nextPathname = normalizePath(nextUrl.pathname);
    const destination = `${nextPathname}${nextUrl.search}${nextUrl.hash}`;
    const current = `${normalizePath(window.location.pathname)}${window.location.search}${window.location.hash}`;

    if (destination !== current) {
      window.history.pushState({}, '', destination);
    }

    setPathname(nextPathname);

    if (nextUrl.hash) {
      scrollToHash(nextUrl.hash);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scrollToHash]);

  return (
    <ProductCatalogProvider>
      <VisualLabProvider>
        <MainLayout pathname={pathname} navigate={navigate} />
      </VisualLabProvider>
    </ProductCatalogProvider>
  );
}
