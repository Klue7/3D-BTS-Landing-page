/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MainLayout } from './components/MainLayout';
import { VisualLabProvider } from './components/VisualLabContext';

export default function App() {
  return (
    <VisualLabProvider>
      <MainLayout />
    </VisualLabProvider>
  );
}

