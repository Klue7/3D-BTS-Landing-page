/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { VisualLabProvider, useVisualLab } from './components/VisualLabContext';
import LoginPage from './components/LoginPage';
import { CustomerPortal } from './components/CustomerPortal';
import { EmployeePortal } from './components/EmployeePortal';
import { CustomizeStudio } from './components/CustomizeStudio';
import { DesignCommunity } from './components/DesignCommunity';

function AppContent() {
  const { isLoggedIn, userRole } = useVisualLab();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/customize" element={<CustomizeStudio />} />
      <Route path="/customize/:designId" element={<CustomizeStudio />} />
      <Route path="/community" element={<DesignCommunity />} />
      <Route path="/customize/gallery" element={<Navigate to="/community?type=generated_design" replace />} />
      <Route path="/projects" element={<Navigate to="/community?type=built_project" replace />} />
      
      <Route 
        path="/portal/*" 
        element={
          isLoggedIn ? (
            userRole === 'customer' ? <CustomerPortal /> : <EmployeePortal />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <VisualLabProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors theme="dark" />
        <AppContent />
        <LoginPage />
      </BrowserRouter>
    </VisualLabProvider>
  );
}

