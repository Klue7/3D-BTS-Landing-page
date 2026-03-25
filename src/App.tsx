/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { VisualLabProvider, useVisualLab } from './components/VisualLabContext';
import LoginPage from './components/LoginPage';
import { CustomerPortal } from './components/CustomerPortal';
import { EmployeePortal } from './components/EmployeePortal';
import { CustomizeStudio } from './components/CustomizeStudio';
import { CustomizeGallery } from './components/CustomizeGallery';
import { BuiltProjects } from './components/BuiltProjects';

function AppContent() {
  const { isLoggedIn, userRole } = useVisualLab();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/customize" element={<CustomizeStudio />} />
      <Route path="/customize/:designId" element={<CustomizeStudio />} />
      <Route path="/customize/gallery" element={<CustomizeGallery />} />
      <Route path="/projects" element={<BuiltProjects />} />
      
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
        <AppContent />
        <LoginPage />
      </BrowserRouter>
    </VisualLabProvider>
  );
}

